import { Color } from '@material-ui/lab';
import axios, { AxiosResponse } from 'axios';
import { get } from 'idb-keyval';

import { API } from '@config/consts';
import { GroupOrTeam, InterviewType, SMSType, Status, Step } from '@config/enums';
import { Application, Interview, R, Recruitment, Member } from '@config/types';
import { stores } from '@stores/index';
import { primitiveStorage } from '@utils/storage';

const { $application, $component, $member, $recruitment } = stores;

class Endpoint {
    static base = API;

    static auth = '/auth';

    static qrCode = (key = '') => `${Endpoint.auth}/member/qrCode/${key}`;

    static login = `${Endpoint.auth}/member/login/`;

    static applications = '/applications';

    static application = (cid: string) => `${Endpoint.applications}/${cid}`;

    static applicationStep = (cid: string) => `${Endpoint.applications}/${cid}/step`;

    static resume = (cid: string) => `${Endpoint.applications}/${cid}/resume`;

    static applicationsInRecruitment = (rid: string, now: Date) =>
        `${Endpoint.applications}/recruitment/${rid}?updatedAt=${+now}`;

    static applicationAllocation = (type: InterviewType, cid?: string) =>
        `${Endpoint.applications}/${cid ? `${cid}/` : ''}interview/${type}`;

    static recruitments = '/recruitments';

    static recruitment = (rid: string) => `${Endpoint.recruitments}/${rid}`;

    static schedule = (rid: string) => `${Endpoint.recruitments}/${rid}/schedule`;

    static interviews = (rid: string, name: GroupOrTeam) => `${Endpoint.recruitments}/${rid}/interviews/${name}`;

    static sms = '/sms';

    static verification = `${Endpoint.sms}/verification/member`;

    static members = '/members';

    static me = `${Endpoint.members}/me`;

    static group = `${Endpoint.members}/group`;

    static admin = `${Endpoint.members}/admin`;
}

const client = axios.create({
    baseURL: Endpoint.base,
    validateStatus: () => true,
});

export const setAuthToken = (token: string) => {
    (client.defaults.headers as { common: Record<string, string> }).common.Authorization = `Bearer ${token}`;
};

setAuthToken($member.token);

const apiWrapper = async <T>(
    action: () => Promise<AxiosResponse<R<T>>>,
    onSuccess: (data: T) => unknown,
    onFailure?: () => unknown,
) => {
    $component.setProgress(true);
    try {
        const { data } = await action();
        $component.setProgress(false);
        switch (data.status) {
            case Status.info:
            case Status.success:
                await onSuccess(data.payload);
                return true;
            case Status.error:
            case Status.warning:
                $component.enqueueSnackbar(data.message, data.status);
                await onFailure?.();
        }
    } catch ({ message }) {
        $component.setProgress(false);
        $component.enqueueSnackbar(message as string, 'error');
        await onFailure?.();
    }
    return false;
};

export const allocateMany = (type: InterviewType, cids: string[]) =>
    apiWrapper(
        () => client.put<R<{ aid: string; time?: string }[]>>(Endpoint.applicationAllocation(type), { cids }),
        (allocations) => {
            $application.allocateMany(
                allocations.map(({ aid, time }) => ({ aid, time: time ? new Date(time) : undefined })),
                type,
            );
            const failed = allocations.filter(({ time }) => !time).length;
            if (failed) {
                $component.enqueueSnackbar(`有${failed}位候选人没有分配到时间(不包括未选择时间的)`, 'info');
            } else {
                $component.enqueueSnackbar('所有候选人均分配了时间(不包括未选择时间的)', 'success');
            }
        },
    );

export const allocateOne = (type: InterviewType, cid: string, time: Date) =>
    apiWrapper(
        () => client.put<R>(Endpoint.applicationAllocation(type, cid), { time }),
        () => {
            $application.allocateOne(type, cid, time);
            $component.enqueueSnackbar('设置成功', 'success');
        },
    );

export const getApplications = (rid: string) => {
    const viewing = primitiveStorage.getItem('viewingId');
    return apiWrapper(
        async () => {
            const applications = await get<Map<string, Application>>('applications');
            if (applications && rid === viewing) {
                $application.setAll(applications);
                $component.enqueueSnackbar('成功获取候选人信息（缓存）', 'success');
                let max = new Date(0);
                for (const [, { updatedAt }] of applications) {
                    if (max < updatedAt) {
                        max = updatedAt;
                    }
                }
                return await client.get<R<Application<string>[]>>(Endpoint.applicationsInRecruitment(rid, max));
            }
            return await client.get<R<Application<string>[]>>(Endpoint.applicationsInRecruitment(rid, new Date(0)));
        },
        (applications) => {
            if (rid !== viewing) {
                $application.clear();
            }
            $application.setMany(
                applications.map(({ interviewAllocations: { group, team }, interviewSelections, updatedAt, ...r }) => ({
                    ...r,
                    updatedAt: new Date(updatedAt),
                    interviewAllocations: {
                        group: group ? new Date(group) : undefined,
                        team: team ? new Date(team) : undefined,
                    },
                    interviewSelections: interviewSelections.map(({ date, ...rest }) => ({
                        ...rest,
                        date: new Date(date),
                    })),
                })),
            );
            $recruitment.setViewingRecruitment(rid);
            $component.enqueueSnackbar('成功获取候选人信息', 'success');
        },
    );
};

export const moveApplication = (id: string, from: Step, to: Step) =>
    apiWrapper(
        () => {
            $application.moveOne(id, to);
            return client.put<R>(Endpoint.applicationStep(id), { from, to });
        },
        () => $component.enqueueSnackbar('移动成功', 'success'),
        () => $application.moveOne(id, from),
    );

export const removeApplication = (id: string) =>
    apiWrapper(
        () => client.delete<R>(Endpoint.application(id)),
        () => {
            $application.removeOne(id);
            $component.enqueueSnackbar('移除成功', 'success');
        },
    );

export const getResume = async (id: string, filename = 'resume') => {
    $component.setProgress(true);
    try {
        const { data, status } = await client.get<Blob>(Endpoint.resume(id), {
            responseType: 'blob',
            onDownloadProgress(event: ProgressEvent) {
                $component.setResumeProgress(event.loaded / event.total, id);
            },
        });
        if (status >= 400) {
            throw JSON.parse(await data.text());
        }
        const url = URL.createObjectURL(new Blob([data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch ({ message, status = 'error' }) {
        $component.enqueueSnackbar(message as string, status as Color);
    }
    $component.setResumeProgress(0, id);
    $component.setProgress(false);
};

export const getAllRecruitments = async () => {
    const recruitments = await get<Map<string, Recruitment>>('recruitments');
    const viewing = primitiveStorage.getItem('viewingId');
    if (recruitments) {
        $recruitment.setAll(recruitments);
        $component.enqueueSnackbar('成功获取招新信息', 'success');
        return;
    }
    return apiWrapper(
        () => client.get<R<Recruitment<string>[]>>(Endpoint.recruitments),
        (recruitments) => {
            $recruitment.setRecruitments(
                recruitments.map(({ beginning, end, deadline, interviews, ...rest }) => ({
                    ...rest,
                    beginning: new Date(beginning),
                    end: new Date(end),
                    deadline: new Date(deadline),
                    interviews: interviews.map(({ date, ...rest }) => ({
                        ...rest,
                        date: new Date(date),
                    })),
                })),
            );
            $recruitment.setViewingRecruitment(viewing ?? recruitments.length ? recruitments[0].id : '');
            $component.enqueueSnackbar('成功获取招新信息', 'success');
        },
    );
};

export const getOneRecruitment = async (rid: string) =>
    apiWrapper(
        () => client.get<R<Recruitment<string>>>(Endpoint.recruitment(rid)),
        ({ beginning, end, deadline, interviews, ...rest }) =>
            $recruitment.setRecruitment({
                ...rest,
                beginning: new Date(beginning),
                end: new Date(end),
                deadline: new Date(deadline),
                interviews: interviews.map(({ date, ...rest }) => ({
                    ...rest,
                    date: new Date(date),
                })),
            }),
    );

export const createRecruitment = (
    data: Pick<Recruitment, 'name' | 'beginning' | 'end' | 'deadline'> & { code: string },
) =>
    apiWrapper(
        () => client.post<R>(Endpoint.recruitments, data),
        () => $component.enqueueSnackbar('已成功发起招新', 'success'),
    );

export const setRecruitmentSchedule = (rid: string, data: Pick<Recruitment, 'beginning' | 'end' | 'deadline'>) =>
    apiWrapper(
        () => client.put<R>(Endpoint.schedule(rid), data),
        () => $component.enqueueSnackbar('已成功修改招新信息', 'success'),
    );

export const setRecruitmentInterviews = (
    rid: string,
    name: GroupOrTeam,
    interviews: Omit<Interview, 'name' | 'id'>[],
) =>
    apiWrapper(
        () => client.put<R>(Endpoint.interviews(rid, name), { interviews }),
        () => $component.enqueueSnackbar('已成功更新面试安排', 'success'),
    );

export const getVerifyCode = () =>
    apiWrapper(
        () => client.get<R>(Endpoint.verification),
        () => $component.enqueueSnackbar('验证码已发送', 'success'),
    );

export const sendSMSToCandidate = (content: {
    type: SMSType;
    time?: string;
    place?: string;
    rest?: string;
    next: Step;
    cids: string[];
    code: string;
}) =>
    apiWrapper(
        () => client.post<R>(Endpoint.sms, content),
        () => $component.enqueueSnackbar('已成功发送短信', 'success'),
    );

export const getMyGroup = async () => {
    const groupInfo = await get<Member[]>('group');
    if (groupInfo && !$member.firstLoad) {
        $member.setGroupInfo(groupInfo);
        return;
    }
    return apiWrapper(
        () => client.get<R<Member[]>>(Endpoint.group),
        (members) => $member.setGroupInfo(members),
    );
};

export const getMyInfo = async () => {
    const member = await get<Member>('member');
    if (member) {
        $member.setMyInfo(member);
        $application.setGroup(member.group);
        return;
    }
    return apiWrapper(
        () => client.get<R<Member>>(Endpoint.me),
        (member) => {
            $member.setMyInfo(member);
            $application.setGroup(member.group);
        },
    );
};

export const setMyInfo = (data: Pick<Member, 'mail' | 'phone' | 'password'>) =>
    apiWrapper(
        () => client.put<R>(Endpoint.me, data),
        () => {
            $member.setMyInfo(data);
            $component.enqueueSnackbar('已成功修改信息', 'success');
        },
    );

export const setGroupAdmin = (uids: string[]) =>
    apiWrapper(
        () => client.put<R<string[]>>(Endpoint.admin, uids),
        (uids) => {
            $member.setGroupAdmins(uids);
            $component.enqueueSnackbar('已成功设置管理员', 'success');
        },
    );

export const loginByQRCode = () =>
    apiWrapper(
        () => client.get<R<string>>(Endpoint.qrCode()),
        (url) => {
            void apiWrapper(
                () => {
                    $member.setQRCode(url);
                    $component.enqueueSnackbar('请尽快用企业微信扫描二维码', 'success');
                    return client.get<R<string>>(Endpoint.qrCode(new URL(url).searchParams.get('key')!));
                },
                (token) => {
                    setAuthToken(token);
                    $member.setToken(token);
                    $component.enqueueSnackbar('已成功登录', 'success');
                },
                () => $member.setQRCode(''),
            );
            // Toggle progress bar off immediately when users are scanning QRCode
            $component.setProgress(false);
        },
    );

export const loginByPassword = (phone: string, password: string) =>
    apiWrapper(
        () => client.post<R<string>>(Endpoint.login, { phone, password }),
        (token) => {
            setAuthToken(token);
            $member.setToken(token);
            $component.enqueueSnackbar('已成功登录', 'success');
        },
    );

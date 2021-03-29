import axios, { AxiosResponse } from 'axios';
import { get } from 'idb-keyval';

import { API } from '@config/consts';
import { GroupOrTeam, InterviewType, SMSType, Status, Step } from '@config/enums';
import { Candidate, Interview, R, Recruitment, User } from '@config/types';
import { stores } from '@stores/index';
import { localStorage } from '@utils/storage';

const { $candidate, $component, $user, $recruitment } = stores;

class Endpoint {
    static base = API;

    static auth = '/auth';

    static qrCode = (key = '') => `${Endpoint.auth}/user/qrCode/${key}`;

    static login = `${Endpoint.auth}/user/login/`;

    static candidate = '/candidates';

    static resume = (cid: string) => `${Endpoint.candidate}/${cid}/resume`;

    static candidates = (rid: string) => `${Endpoint.candidate}/recruitment/${rid}`;

    static allocation = (type: InterviewType, cid?: string) =>
        `${Endpoint.candidate}/${cid ? `${cid}/` : ''}interview/${type}`;

    static recruitments = '/recruitments';

    static schedule = (rid: string) => `${Endpoint.recruitments}/${rid}/schedule`;

    static interviews = (rid: string, name: GroupOrTeam) => `${Endpoint.recruitments}/${rid}/interviews/${name}`;

    static sms = '/sms';

    static verification = `${Endpoint.sms}/verification/user`;

    static users = '/users';

    static me = `${Endpoint.users}/me`;

    static group = `${Endpoint.users}/group`;

    static admin = `${Endpoint.users}/admin`;
}

const client = axios.create({
    baseURL: Endpoint.base,
});

export const setAuthToken = (token: string) => {
    (client.defaults.headers as { common: Record<string, string> }).common['Authorization'] = `Bearer ${token}`;
};

setAuthToken($user.token);

const apiWrapper = async <T>(
    action: () => Promise<AxiosResponse<R<T>>>,
    onSuccess: (data: T) => void | Promise<void>,
    onFailure?: () => void | Promise<void>,
) => {
    $component.setProgress(true);
    try {
        const { data } = await action();
        $component.setProgress(false);
        switch (data.status) {
            case Status.info:
            case Status.success:
                await onSuccess(data.payload);
                break;
            case Status.error:
            case Status.warning:
                $component.enqueueSnackbar(data.message, data.status);
                await onFailure?.();
                break;
        }
    } catch ({ message }) {
        $component.setProgress(false);
        $component.enqueueSnackbar(message, 'error');
        await onFailure?.();
    }
};

export const allocateMany = (type: InterviewType, cids: string[]) =>
    apiWrapper(
        () =>
            client.put<R<{ id: string; time?: string }[]>>(Endpoint.allocation(type), {
                cids,
            }),
        (allocations) => {
            $candidate.allocateMany(
                allocations.map(({ id, time }) => ({ id, time: time ? new Date(time) : undefined })),
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
        () => client.put<R>(Endpoint.allocation(type, cid), { time }),
        () => {
            $candidate.allocateOne(type, cid, time);
            $component.enqueueSnackbar('设置成功', 'success');
        },
    );

export const getCandidates = (rid: string) =>
    apiWrapper(
        async () => {
            const candidates = await get<Candidate[]>('candidates');
            const viewing = localStorage.getItem('viewing');
            if (candidates && rid === viewing) {
                $candidate.setAll(candidates);
                $component.toggleFabOff();
                $component.enqueueSnackbar('成功获取候选人信息（缓存）', 'success');
            }
            return await client.get<R<Candidate<string>[]>>(Endpoint.candidates(rid));
        },
        (candidates) => {
            $candidate.setAll(
                candidates.map(({ interviewAllocations: { group, team }, interviewSelections, ...rest }) => ({
                    ...rest,
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
            $component.toggleFabOff();
            $component.enqueueSnackbar('成功获取候选人信息（线上）', 'success');
        },
    );

export const getResume = async (cid: string) => {
    $component.setProgress(true);
    try {
        const { data, headers } = await client.get<Blob>(Endpoint.resume(cid), {
            responseType: 'blob',
            onDownloadProgress(event: ProgressEvent) {
                $component.setResumeProgress(event.loaded / event.total, cid);
            },
        });
        let filename = 'resume';
        const disposition = (headers as Record<string, string>)['content-disposition'];
        if (disposition && disposition.includes('attachment')) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
            if (matches?.[1]) {
                filename = decodeURIComponent(matches[1].replace(/['"]/g, '').replace(/.{2}/g, '%$&'));
            }
        }
        const url = URL.createObjectURL(new Blob([data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        $component.setResumeProgress(0, cid);
    } catch ({ message }) {
        $component.enqueueSnackbar(message, 'error');
    }
    $component.setProgress(false);
};

export const getAllRecruitments = async () => {
    const recruitments = await get<Recruitment[]>('recruitments');
    const viewing = localStorage.getItem('viewing');
    const shouldUpdateRecruitment = $recruitment.shouldUpdateRecruitment;
    if (recruitments && !shouldUpdateRecruitment) {
        $recruitment.setRecruitments(recruitments);
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
            $recruitment.setViewingRecruitment(viewing ?? recruitments[0]?.id ?? '');
            $component.enqueueSnackbar('成功获取招新信息', 'success');
        },
    );
};

export const createRecruitment = (
    data: Pick<Recruitment, 'name' | 'beginning' | 'end' | 'deadline'> & { code: string },
) =>
    apiWrapper(
        () => client.post<R>(Endpoint.recruitments, data),
        () => {
            $recruitment.setShouldUpdateRecruitment();
            $component.enqueueSnackbar('已成功发起招新', 'success');
            return getAllRecruitments();
        },
    );

export const setRecruitmentSchedule = (rid: string, data: Pick<Recruitment, 'beginning' | 'end' | 'deadline'>) =>
    apiWrapper(
        () => client.put<R>(Endpoint.schedule(rid), data),
        () => {
            $recruitment.setShouldUpdateRecruitment();
            $component.enqueueSnackbar('已成功修改招新信息', 'success');
            return getAllRecruitments();
        },
    );

export const createRecruitmentInterviews = (
    rid: string,
    name: GroupOrTeam,
    data: {
        interviews: Pick<Interview, 'date' | 'period' | 'slotNumber'>;
    },
) =>
    apiWrapper(
        () => client.post<R>(Endpoint.interviews(rid, name), data),
        () => {
            $recruitment.setShouldUpdateRecruitment();
            $component.enqueueSnackbar('已成功设置面试安排', 'success');
            return getAllRecruitments();
        },
    );

export const setRecruitmentInterviews = (
    rid: string,
    name: GroupOrTeam,
    data: {
        interviews: Pick<Interview, 'id' | 'date' | 'period' | 'slotNumber'>;
    },
) =>
    apiWrapper(
        () => client.put<R>(Endpoint.interviews(rid, name), data),
        () => {
            $recruitment.setShouldUpdateRecruitment();
            $component.enqueueSnackbar('已成功更新面试安排', 'success');
            return getAllRecruitments();
        },
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
    const groupInfo = await get<User[]>('group');
    if (groupInfo && !$user.firstLoad) {
        $user.setGroupInfo(groupInfo);
        return;
    }
    return apiWrapper(
        () => client.get<R<User[]>>(Endpoint.group),
        (users) => $user.setGroupInfo(users),
    );
};

export const getMyInfo = async () => {
    const user = await get<User>('user');
    if (user) {
        $user.setUserInfo(user);
        $candidate.setGroup(user.group);
        return;
    }
    return apiWrapper(
        () => client.get<R<User>>(Endpoint.me),
        (user) => {
            $user.setUserInfo(user);
            $candidate.setGroup(user.group);
        },
    );
};

export const setMyInfo = (data: Pick<User, 'mail' | 'phone' | 'password'>) =>
    apiWrapper(
        () => client.put<R>(Endpoint.me, data),
        () => {
            $user.setUserInfo(data);
            $component.enqueueSnackbar('已成功修改信息', 'success');
        },
    );

export const setGroupAdmin = (uids: string[]) =>
    apiWrapper(
        () => client.put<R<string[]>>(Endpoint.admin, uids),
        (uids) => {
            $user.setGroupAdmins(uids);
            $component.enqueueSnackbar('已成功设置管理员', 'success');
        },
    );

export const loginByQRCode = () =>
    apiWrapper(
        () => client.get<R<string>>(Endpoint.qrCode()),
        (url) =>
            apiWrapper(
                () => {
                    $user.setQRCode(url);
                    $component.enqueueSnackbar('请尽快用企业微信扫描二维码', 'success');
                    return client.get<R<string>>(Endpoint.qrCode(new URL(url).searchParams.get('key')!));
                },
                (token) => {
                    setAuthToken(token);
                    $user.setToken(token);
                    $component.enqueueSnackbar('已成功登录', 'success');
                },
            ),
    );

export const loginByPassword = (phone: string, password: string) =>
    apiWrapper(
        () => client.post<R<string>>(Endpoint.login, { phone, password }),
        (token) => {
            setAuthToken(token);
            $user.setToken(token);
            $component.enqueueSnackbar('已成功登录', 'success');
        },
    );

import axios, { AxiosResponse } from 'axios';

import { API } from '@config/consts';
import { Candidate, Group, Recruitment, Step, Time, User } from '@config/types';
import { stores } from '@stores/index';
import { localStorage } from '@utils/storage';

const { $candidate, $component, $user, $recruitment } = stores;

class Endpoint {
    static base = API;

    static recruitments = '/recruitment/';

    static verification = '/sms/verification/user';

    static sms = '/sms/';

    static user = '/user/';

    static group = '/user/group/';

    static login = '/user/login/';

    static admin = '/user/admin/';

    static interview = (interviewType: string, cid?: string) =>
        `/candidate/${cid ? `${cid}/` : ''}interview/${interviewType}`;

    static candidates = (title: string, group?: Group, step?: Step) =>
        `/candidate/${JSON.stringify({ title, step, group })}`;

    static resume = (cid: string) => `/candidate/${cid}/resume`;

    static recruitment = (title: string) => `/recruitment/title/${title}`;

    static qrCode = (key = '') => `/user/qrCode/${key}`;
}

type SuccessResponse<T> = T & {
    type: 'success';
};

interface FailureResponse {
    type: 'warning' | 'error';
    message?: string;
    messages?: string[];
}

type R<T = Record<string, never>> = SuccessResponse<T> | FailureResponse;

const client = axios.create({
    baseURL: Endpoint.base,
});

export const setAuthToken = (token: string) => {
    (client.defaults.headers as { common: Record<string, string> }).common['Authorization'] = `Bearer ${token}`;
};

setAuthToken($user.token);

const apiWrapper = async <T>(
    action: () => Promise<AxiosResponse<R<T>>>,
    onSuccess: (data: SuccessResponse<T>) => void | Promise<void>,
    onFailure?: () => void | Promise<void>,
) => {
    $component.setProgress(true);
    try {
        const { data } = await action();
        $component.setProgress(false);
        if (data.type === 'success') {
            await onSuccess(data);
        } else {
            const messages = data.messages || [data.message!];
            messages.forEach((message) => {
                $component.enqueueSnackbar(message, data.type || 'error');
            });
            await onFailure?.();
        }
    } catch ({ message }) {
        $component.setProgress(false);
        $component.enqueueSnackbar(message, 'error');
        await onFailure?.();
    }
};

export const allocateAll = (interviewType: 'group' | 'team') =>
    apiWrapper(
        () =>
            client.put<R<{ allocations: { id: string; time: number }[] }>>(Endpoint.interview(interviewType), {
                title: $recruitment.viewing,
            }),
        ({ allocations }) => {
            $candidate.allocateAll(allocations, interviewType);
            const failed = allocations.filter(({ time }) => !time).length;
            if (failed) {
                $component.enqueueSnackbar(`有${failed}位候选人没有分配到时间！(不包括未选择时间的)`, 'info');
            } else {
                $component.enqueueSnackbar('所有候选人均分配了时间！(不包括未选择时间的)', 'success');
            }
        },
    );

export const allocateOne = (interviewType: 'group' | 'team', cid: string, time: number) =>
    apiWrapper(
        () => client.put<R>(Endpoint.interview(interviewType, cid), { time }),
        () => {
            $candidate.allocateOne(interviewType, cid, time);
            $component.enqueueSnackbar('设置成功！', 'success');
        },
    );

export const getCandidates = (title: string, group?: Group, step?: Step) =>
    apiWrapper(
        () => {
            const candidates = localStorage.getItem('candidates');
            const viewing = localStorage.getItem('viewing');
            if (candidates && title === viewing) {
                let data = candidates;
                if (step) data = data.filter((candidate) => candidate.step === step);
                if (group) data = data.filter((candidate) => candidate.group === group);
                $candidate.addCandidates(data);
                $component.toggleFabOff();
                $component.enqueueSnackbar('成功获取候选人信息（缓存）', 'success');
            }
            return client.get<R<{ data: Candidate[] }>>(Endpoint.candidates(title, group, step));
        },
        ({ data }) => {
            $candidate.addCandidates(data);
            $recruitment.setViewingRecruitment(title);
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
                filename = decodeURIComponent(
                    atob(matches[1].replace(/['"]/g, ''))
                        .split('')
                        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
                        .join(''),
                );
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

export const getRecruitments = () => {
    const recruitments = localStorage.getItem('recruitments');
    const viewing = localStorage.getItem('viewing');
    const shouldUpdateRecruitment = $recruitment.shouldUpdateRecruitment;
    if (recruitments && !shouldUpdateRecruitment) {
        $recruitment.setRecruitments(recruitments);
        $component.enqueueSnackbar('成功获取招新信息', 'success');
        return;
    }
    return apiWrapper(
        () => client.get<R<{ data: Recruitment[] }>>(Endpoint.recruitments),
        ({ data }) => {
            data.sort((prev, next) => prev.begin - next.begin);
            const newViewing = viewing ? viewing : data.slice(-1)[0] ? data.slice(-1)[0].title : '';
            $recruitment.setRecruitments(data);
            $recruitment.setViewingRecruitment(newViewing);
            $component.enqueueSnackbar('成功获取招新信息', 'success');
        },
    );
};

export const launchRecruitment = (info: Partial<Recruitment & { code: string }>) =>
    apiWrapper(
        () => client.post<R>(Endpoint.recruitments, info),
        () => {
            $recruitment.setShouldUpdateRecruitment();
            $component.enqueueSnackbar('已成功发起招新！', 'success');
            return getRecruitments();
        },
    );

export const setRecruitment = (data: {
    title: string;
    begin: number;
    end: number;
    stop: number;
    group?: Group;
    groupInterview?: Time[];
    teamInterview?: Time[];
}) =>
    apiWrapper(
        () => client.put<R>(Endpoint.recruitment(data.title), data),
        () => {
            $recruitment.setShouldUpdateRecruitment();
            $component.enqueueSnackbar('已成功修改招新信息！', 'success');
            return getRecruitments();
        },
    );

export const getVerifyCode = () =>
    apiWrapper(
        () => client.get<R>(Endpoint.verification),
        () => $component.enqueueSnackbar('验证码已发送！', 'success'),
    );

export const sendSMS = (content: Record<string, unknown>) =>
    apiWrapper(
        () => client.post<R>(Endpoint.sms, content),
        () => $component.enqueueSnackbar('已成功发送短信！', 'success'),
    );

export const getGroup = () => {
    const groupInfo = localStorage.getItem('group');
    if (groupInfo && !$user.firstLoad) {
        $user.setGroupInfo(groupInfo);
        return;
    }
    return apiWrapper(
        () => client.get<R<{ data: User[] }>>(Endpoint.group),
        ({ data }) => $user.setGroupInfo(data),
    );
};

export const getUserInfo = () => {
    const user = localStorage.getItem('user');
    if (user) {
        $user.setUserInfo(user);
        $candidate.setGroup(user.group);
        return;
    }
    return apiWrapper(
        () => client.get<R<{ data: User }>>(Endpoint.user),
        ({ data }) => {
            $user.setUserInfo(data);
            $candidate.setGroup(data.group);
        },
    );
};

export const loginViaQRCode = () =>
    apiWrapper(
        () => client.get<R<{ key: string }>>(Endpoint.qrCode()),
        ({ key }) =>
            apiWrapper(
                () => {
                    $user.setQRCode(key);
                    $component.enqueueSnackbar('请尽快用企业微信扫描二维码！', 'success');
                    return client.get<R<{ token: string }>>(Endpoint.qrCode(key));
                },
                ({ token }) => {
                    setAuthToken(token);
                    $user.setToken(token);
                    $component.enqueueSnackbar('已成功登录！', 'success');
                },
            ),
    );

export const loginViaPassword = (phone: string, password: string) =>
    apiWrapper(
        () => client.post<R<{ token: string }>>(Endpoint.login, { phone, password }),
        ({ token }) => {
            setAuthToken(token);
            $user.setToken(token);
            $component.enqueueSnackbar('已成功登录！', 'success');
        },
    );

export const setGroupAdmin = (data: { group: string; who: string[] }) =>
    apiWrapper(
        () => client.put<R<{ newAdmins: string[] }>>(Endpoint.admin, data),
        ({ newAdmins }) => {
            $user.setGroupAdmins(newAdmins);
            $component.enqueueSnackbar('已成功修改管理员！', 'success');
        },
    );

export const setUserInfo = (data: { phone: string; mail: string; password?: string }) =>
    apiWrapper(
        () => client.put<R<{ newAdmins: string[] }>>(Endpoint.user, data),
        () => {
            $user.setUserInfo(data);
            $component.enqueueSnackbar('已成功修改信息！', 'success');
        },
    );

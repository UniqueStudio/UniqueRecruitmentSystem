import axios, { AxiosResponse } from 'axios';
import { API } from '../config/consts';
import { Candidate, Group, Recruitment, Step, Time, User } from '../config/types';
import { stores } from '../stores';
import { localStorage } from '../utils/storage';

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
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const apiWrapper = async <T>(
    action: () => Promise<AxiosResponse<R<T>>>,
    onSuccess: (data: SuccessResponse<T>) => void | Promise<void>,
    onFailure?: () => void | Promise<void>,
) => {
    stores.componentStateStore.setProgress(true);
    try {
        const { data } = await action();
        stores.componentStateStore.setProgress(false);
        if (data.type === 'success') {
            await onSuccess(data);
        } else {
            const messages = data.messages || [data.message!];
            messages.forEach((message) => {
                stores.componentStateStore.enqueueSnackbar(message, data.type || 'error');
            });
            await onFailure?.();
        }
    } catch ({ message }) {
        stores.componentStateStore.setProgress(false);
        stores.componentStateStore.enqueueSnackbar(message, 'error');
        await onFailure?.();
    }
};

export const allocateAll = (interviewType: 'group' | 'team') =>
    apiWrapper(
        () =>
            client.put<R<{ allocations: { id: string; time: number }[] }>>(Endpoint.interview(interviewType), {
                title: stores.recruitmentStore.viewing,
            }),
        ({ allocations }) => {
            stores.candidateStore.allocateAll(allocations, interviewType);
            const failed = allocations.filter(({ time }) => !time).length;
            if (failed) {
                stores.componentStateStore.enqueueSnackbar(
                    `有${failed}位候选人没有分配到时间！(不包括未选择时间的)`,
                    'info',
                );
            } else {
                stores.componentStateStore.enqueueSnackbar('所有候选人均分配了时间！(不包括未选择时间的)', 'success');
            }
        },
    );

export const allocateOne = (interviewType: 'group' | 'team', cid: string, time: number) =>
    apiWrapper(
        () => client.put<R>(Endpoint.interview(interviewType, cid), { time }),
        () => {
            stores.candidateStore.allocateOne(interviewType, cid, time);
            stores.componentStateStore.enqueueSnackbar('设置成功！', 'success');
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
                stores.candidateStore.addCandidates(data);
                stores.componentStateStore.toggleFabOff();
                stores.componentStateStore.enqueueSnackbar('成功获取候选人信息（缓存）', 'success');
            }
            return client.get<R<{ data: Candidate[] }>>(Endpoint.candidates(title, group, step));
        },
        ({ data }) => {
            stores.candidateStore.addCandidates(data);
            stores.recruitmentStore.setViewingRecruitment(title);
            stores.componentStateStore.toggleFabOff();
            stores.componentStateStore.enqueueSnackbar('成功获取候选人信息（线上）', 'success');
        },
    );

export const getResume = async (cid: string) => {
    stores.componentStateStore.setProgress(true);
    try {
        const { data, headers } = await client.get<Blob>(Endpoint.resume(cid), {
            responseType: 'blob',
            onDownloadProgress(event: ProgressEvent) {
                stores.componentStateStore.setResumeProgress(event.loaded / event.total, cid);
            },
        });
        let filename = 'resume';
        const disposition: string = headers['content-disposition'];
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
        stores.componentStateStore.setResumeProgress(0, cid);
    } catch ({ message }) {
        stores.componentStateStore.enqueueSnackbar(message, 'error');
    }
    stores.componentStateStore.setProgress(false);
};

export const getRecruitments = () => {
    const recruitments = localStorage.getItem('recruitments');
    const viewing = localStorage.getItem('viewing');
    const shouldUpdateRecruitment = stores.recruitmentStore.shouldUpdateRecruitment;
    if (recruitments && !shouldUpdateRecruitment) {
        stores.recruitmentStore.setRecruitments(recruitments);
        stores.componentStateStore.enqueueSnackbar('成功获取招新信息', 'success');
        return;
    }
    return apiWrapper(
        () => client.get<R<{ data: Recruitment[] }>>(Endpoint.recruitments),
        ({ data }) => {
            data.sort((prev, next) => prev.begin - next.begin);
            const newViewing = viewing ? viewing : data.slice(-1)[0] ? data.slice(-1)[0].title : '';
            stores.recruitmentStore.setRecruitments(data);
            stores.recruitmentStore.setViewingRecruitment(newViewing);
            stores.componentStateStore.enqueueSnackbar('成功获取招新信息', 'success');
        },
    );
};

export const launchRecruitment = (info: Partial<Recruitment & { code: string }>) =>
    apiWrapper(
        () => client.post<R>(Endpoint.recruitments, info),
        () => {
            stores.recruitmentStore.setShouldUpdateRecruitment();
            stores.componentStateStore.enqueueSnackbar('已成功发起招新！', 'success');
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
            stores.recruitmentStore.setShouldUpdateRecruitment();
            stores.componentStateStore.enqueueSnackbar('已成功修改招新信息！', 'success');
            return getRecruitments();
        },
    );

export const getVerifyCode = () =>
    apiWrapper(
        () => client.get<R>(Endpoint.verification),
        () => stores.componentStateStore.enqueueSnackbar('验证码已发送！', 'success'),
    );

export const sendSMS = (content: Record<string, unknown>) =>
    apiWrapper(
        () => client.post<R>(Endpoint.sms, content),
        () => stores.componentStateStore.enqueueSnackbar('已成功发送短信！', 'success'),
    );

export const getGroup = () => {
    const groupInfo = localStorage.getItem('group');
    if (groupInfo && !stores.userStore.firstLoad) {
        stores.userStore.setGroupInfo(groupInfo);
        return;
    }
    return apiWrapper(
        () => client.get<R<{ data: User[] }>>(Endpoint.group),
        ({ data }) => stores.userStore.setGroupInfo(data),
    );
};

export const getUserInfo = () => {
    const user = localStorage.getItem('user');
    if (user) {
        stores.userStore.setUserInfo(user);
        stores.candidateStore.setGroup(user.group);
        return;
    }
    return apiWrapper(
        () => client.get<R<{ data: User }>>(Endpoint.user),
        ({ data }) => {
            stores.userStore.setUserInfo(data);
            stores.candidateStore.setGroup(data.group);
        },
    );
};

export const loginViaQRCode = () =>
    apiWrapper(
        () => client.get<R<{ key: string }>>(Endpoint.qrCode()),
        ({ key }) =>
            apiWrapper(
                () => {
                    stores.userStore.setQRCode(key);
                    stores.componentStateStore.enqueueSnackbar('请尽快用企业微信扫描二维码！', 'success');
                    return client.get<R<{ token: string }>>(Endpoint.qrCode(key));
                },
                ({ token }) => {
                    stores.userStore.setToken(token);
                    stores.componentStateStore.enqueueSnackbar('已成功登录！', 'success');
                },
            ),
    );

export const loginViaPassword = (phone: string, password: string) =>
    apiWrapper(
        () => client.post<R<{ token: string }>>(Endpoint.login, { phone, password }),
        ({ token }) => {
            stores.userStore.setToken(token);
            stores.componentStateStore.enqueueSnackbar('已成功登录！', 'success');
        },
    );

export const setGroupAdmin = (data: { group: string; who: string[] }) =>
    apiWrapper(
        () => client.put<R<{ newAdmins: string[] }>>(Endpoint.admin, data),
        ({ newAdmins }) => {
            stores.userStore.setGroupAdmins(newAdmins);
            stores.componentStateStore.enqueueSnackbar('已成功修改管理员！', 'success');
        },
    );

export const setUserInfo = (data: { phone: string; mail: string; password?: string }) =>
    apiWrapper(
        () => client.put<R<{ newAdmins: string[] }>>(Endpoint.user, data),
        () => {
            stores.userStore.setUserInfo(data);
            stores.componentStateStore.enqueueSnackbar('已成功修改信息！', 'success');
        },
    );

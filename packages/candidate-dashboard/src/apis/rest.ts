import { API, Application, Candidate, R, Recruitment, Status } from '@uniqs/config';
import axios, { AxiosResponse } from 'axios';

import { setInfo, setToken } from '@stores/candidate';
import { enqueueSnackbar, setProgress } from '@stores/component';
import store from '@stores/index';
import { setRecruitments } from '@stores/recruitment';

class Endpoint {
    static base = (import.meta.env.VITE_PUBLIC_API ?? API) as string;

    static auth = '/auth';

    static candidateLogin = `${Endpoint.auth}/candidate/login/`;

    static candidates = '/candidates';

    static me = `${Endpoint.candidates}/me`;

    static applications = '/applications';

    static recruitments = '/recruitments';

    static pending = `${Endpoint.recruitments}/pending`;

    static sms = '/sms';

    static verification = (phone: string) => `${Endpoint.sms}/verification/candidate/${phone}`;
}

const client = axios.create({
    baseURL: Endpoint.base,
    validateStatus: () => true,
});

client.interceptors.request.use((config) => {
    (config.headers as Record<string, string>).Authorization = `Bearer ${store.getState().candidate.token}`;
    return config;
});

export const apiWrapper = async <T>(
    action: () => Promise<AxiosResponse<R<T>>>,
    onSuccess: (data: T) => unknown,
    onFailure?: () => unknown,
) => {
    try {
        const { data } = await action();
        switch (data.status) {
            case Status.info:
            case Status.success:
                await onSuccess(data.payload);
                return true;
            case Status.error:
            case Status.warning:
                store.dispatch(enqueueSnackbar({ message: data.message, variant: data.status }));
                await onFailure?.();
        }
    } catch ({ message }) {
        if (typeof message === 'string') {
            store.dispatch(enqueueSnackbar({ message, variant: 'error' }));
        }
        await onFailure?.();
    }
    return false;
};

export const loginByPassword = (phone: string, password: string) =>
    apiWrapper(
        () => client.post<R<string>>(Endpoint.candidateLogin, { phone, password }),
        async (token) => {
            const { primitiveStorage } = await import('@utils/storage');
            primitiveStorage.set('token', token);
            store.dispatch(setToken(token));
            store.dispatch(enqueueSnackbar({ message: '已成功登录', variant: 'success' }));
        },
    );

export const getVerificationCode = (phone: string) =>
    apiWrapper(
        () => client.get<R>(Endpoint.verification(phone)),
        () => {
            store.dispatch(enqueueSnackbar({ message: '已成功发送验证码', variant: 'success' }));
        },
    );

export const createCandidate = (
    data: Pick<Candidate, 'name' | 'gender' | 'mail' | 'phone' | 'password'> & { code: string },
) =>
    apiWrapper(
        () => client.post<R>(Endpoint.candidates, data),
        () => {
            store.dispatch(enqueueSnackbar({ message: '已成功注册', variant: 'success' }));
        },
    );

export const getMyInfo = () =>
    apiWrapper(
        () => client.get<R<Candidate>>(Endpoint.me),
        (candidate) => {
            store.dispatch(setInfo(candidate));
        },
    );

export const getPendingRecruitments = () =>
    apiWrapper(
        () => client.get<R<Recruitment[]>>(Endpoint.pending),
        (recruitments) => {
            store.dispatch(setRecruitments(recruitments));
        },
    );

export const createApplication = (
    data: Pick<Application, 'grade' | 'institute' | 'major' | 'rank' | 'group' | 'intro' | 'isQuick' | 'referrer'> & {
        resume: FileList | undefined;
        rid: string;
    },
) =>
    apiWrapper(
        () => {
            const form = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value instanceof FileList) {
                    form.append(key, value[0]);
                } else if (value !== undefined) {
                    form.append(key, value.toString());
                }
            });
            return client.post<R>(Endpoint.applications, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress({ loaded, total }: ProgressEvent) {
                    store.dispatch(setProgress(loaded / total));
                },
            });
        },
        () => {
            store.dispatch(setProgress(0));
            store.dispatch(enqueueSnackbar({ message: '已成功提交', variant: 'success' }));
        },
        () => {
            store.dispatch(setProgress(0));
        },
    );


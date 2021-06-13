import { RestClient } from '@uniqs/apis';
import { API, Candidate, Code } from '@uniqs/config';

import { setInfo, setToken } from '@stores/candidate';
import { enqueueSnackbar, setProgress } from '@stores/component';
import store from '@stores/index';
import { setRecruitments } from '@stores/recruitment';

const client = new RestClient((import.meta.env.VITE_PUBLIC_API ?? API) as string);

client.addRequestInterceptor((config) => {
    (config.headers as Record<string, string>).Authorization = `Bearer ${store.getState().candidate.token}`;
    return config;
});

const apiWrapper = client.apiWrapper(
    () => undefined,
    (message, status) => store.dispatch(enqueueSnackbar({ message, variant: status })),
);

export const loginByPassword = (phone: string, password: string) =>
    apiWrapper(
        () => client.authCandidateByPassword(phone, password),
        async (token) => {
            const { primitiveStorage } = await import('@utils/storage');
            primitiveStorage.set('token', token);
            store.dispatch(setToken(token));
            store.dispatch(enqueueSnackbar({ message: '已成功登录', variant: 'success' }));
        },
    );

export const getCodeForOther = (phone: string) =>
    apiWrapper(
        () => client.getCodeForOther(phone),
        () => {
            store.dispatch(enqueueSnackbar({ message: '已成功发送验证码', variant: 'success' }));
        },
    );

export const getCodeForCandidate = () =>
    apiWrapper(
        () => client.getCodeForCandidate(),
        () => {
            store.dispatch(enqueueSnackbar({ message: '已成功发送验证码', variant: 'success' }));
        },
    );

export const createCandidate = (data: Pick<Candidate, 'name' | 'gender' | 'mail' | 'phone' | 'password'> & Code) =>
    apiWrapper(
        () => client.createCandidate(data),
        () => {
            store.dispatch(enqueueSnackbar({ message: '已成功注册', variant: 'success' }));
        },
    );

export const getMyInfo = () =>
    apiWrapper(
        () => client.getCandidateInfo(),
        (candidate) => {
            store.dispatch(setInfo(candidate));
        },
    );

export const getPendingRecruitments = () =>
    apiWrapper(
        () => client.getPendingRecruitments(),
        (recruitments) => {
            store.dispatch(setRecruitments(recruitments));
        },
    );

export const createApplication = (data: Parameters<typeof client.createApplication>[0]) =>
    apiWrapper(
        () => client.createApplication(data, ({ loaded, total }) => store.dispatch(setProgress(loaded / total))),
        () => {
            store.dispatch(setProgress(0));
            store.dispatch(enqueueSnackbar({ message: '已成功提交', variant: 'success' }));
            return getMyInfo();
        },
        () => {
            store.dispatch(setProgress(0));
        },
    );

export const setApplication = (aid: string, data: Parameters<typeof client.setApplication>[1]) =>
    apiWrapper(
        () => client.setApplication(aid, data, ({ loaded, total }) => store.dispatch(setProgress(loaded / total))),
        () => {
            store.dispatch(setProgress(0));
            store.dispatch(enqueueSnackbar({ message: '已成功更新', variant: 'success' }));
            return getMyInfo();
        },
        () => {
            store.dispatch(setProgress(0));
        },
    );

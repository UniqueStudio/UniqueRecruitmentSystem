import { setInfo, setToken } from '@stores/candidate';
import { enqueueSnackbar, setProgress } from '@stores/component';
import store from '@stores/index';
import { setInterviews, setRecruitments } from '@stores/recruitment';
import { RestClient } from '@uniqs/apis';
import { API, InterviewType, Status } from '@uniqs/config';

const client = new RestClient((import.meta.env.VITE_PUBLIC_API ?? API) as string);

client.addRequestInterceptor((config) => {
    (config.headers as Record<string, string>).Authorization = `Bearer ${store.getState().candidate.token}`;
    return config;
});

const apiWrapper = client.apiWrapper(
    () => undefined,
    (message, status) => store.dispatch(enqueueSnackbar([message, status])),
);

export const loginByPassword = (phone: string, password: string) =>
    apiWrapper(
        () => client.authCandidateByPassword(phone, password),
        async (token) => {
            const { primitiveStorage } = await import('@utils/storage');
            primitiveStorage.set('token', token);
            store.dispatch(setToken(token));
            store.dispatch(enqueueSnackbar(['已成功登录', Status.success]));
        },
    );

export const resetPassword = (data: Parameters<typeof client.resetCandidatePassword>[0]) =>
    apiWrapper(
        () => client.resetCandidatePassword(data),
        () => {
            store.dispatch(enqueueSnackbar(['已成功重置', Status.success]));
        },
    );

export const getCodeForOther = (phone: string) =>
    apiWrapper(
        () => client.getCodeForOther(phone),
        () => {
            store.dispatch(enqueueSnackbar(['已成功发送验证码', Status.success]));
        },
    );

export const getCodeForCandidate = () =>
    apiWrapper(
        () => client.getCodeForCandidate(),
        () => {
            store.dispatch(enqueueSnackbar(['已成功发送验证码', Status.success]));
        },
    );

export const createCandidate = (data: Parameters<typeof client.createCandidate>[0]) =>
    apiWrapper(
        () => client.createCandidate(data),
        () => {
            store.dispatch(enqueueSnackbar(['已成功注册', Status.success]));
        },
    );

export const getMyInfo = () =>
    apiWrapper(
        () => client.getCandidateInfo(),
        (candidate) => {
            store.dispatch(setInfo(candidate));
        },
    );

export const setMyInfo = (data: Parameters<typeof client.setCandidateInfo>[0]) =>
    apiWrapper(
        () => client.setCandidateInfo(data),
        () => {
            store.dispatch(enqueueSnackbar(['已成功更新', Status.success]));
            return getMyInfo();
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
            store.dispatch(enqueueSnackbar(['已成功提交', Status.success]));
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
            store.dispatch(enqueueSnackbar(['已成功更新', Status.success]));
            return getMyInfo(); // TODO: get avoid of sending requests again
        },
        () => {
            store.dispatch(setProgress(0));
        },
    );

export const abandonApplication = (aid: string) =>
    apiWrapper(
        () => client.abandonApplication(aid),
        () => {
            store.dispatch(enqueueSnackbar(['已成功放弃', Status.success]));
            return getMyInfo();
        },
    );

export const getSlots = (aid: string, type: InterviewType) =>
    apiWrapper(
        () => client.getInterviewSlots(aid, type),
        (interviews) => {
            store.dispatch(setInterviews(interviews));
            return getMyInfo();
        },
    );

export const selectInterview = (aid: string, type: InterviewType, iids: string[]) =>
    apiWrapper(
        () => client.selectInterviewSlots(aid, type, iids),
        () => {
            store.dispatch(enqueueSnackbar(['已成功选择', Status.success]));
            return getMyInfo();
        },
    );

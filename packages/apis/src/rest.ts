import {
    Application,
    Candidate,
    Code,
    GroupOrTeam,
    Interview,
    InterviewType,
    Member,
    R,
    Recruitment,
    SMSType,
    Status,
    Step,
} from '@uniqs/config';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

class Endpoint {
    static auth = '/auth';
    static qrCode = (key = '') => `${Endpoint.auth}/member/qrCode/${key}`;
    static memberLogin = `${Endpoint.auth}/member/login/`;
    static candidateLogin = `${Endpoint.auth}/candidate/login/`;

    static applications = '/applications';
    static application = (aid: string) => `${Endpoint.applications}/${aid}`;
    static step = (aid: string) => `${Endpoint.applications}/${aid}/step`;
    static abandoned = (aid: string) => `${Endpoint.applications}/${aid}/abandoned`;
    static resume = (aid: string) => `${Endpoint.applications}/${aid}/resume`;
    static slots = (aid: string, type: InterviewType) => `${Endpoint.applications}/${aid}/slots/${type}`;
    static applicationsInRecruitment = (rid: string) => `${Endpoint.applications}/recruitment/${rid}`;
    static applicationAllocation = (type: InterviewType, aid?: string) =>
        `${Endpoint.applications}/${aid ? `${aid}/` : ''}interview/${type}`;

    static recruitments = '/recruitments';
    static pending = `${Endpoint.recruitments}/pending`;
    static recruitment = (rid: string) => `${Endpoint.recruitments}/${rid}`;
    static schedule = (rid: string) => `${Endpoint.recruitments}/${rid}/schedule`;
    static interviews = (rid: string, name: GroupOrTeam) => `${Endpoint.recruitments}/${rid}/interviews/${name}`;

    static sms = '/sms';
    static verifyMember = `${Endpoint.sms}/verification/member`;
    static verifyCandidate = `${Endpoint.sms}/verification/candidate`;
    static verifyOthers = (phone: string) => `${Endpoint.sms}/verification/other/${phone}`;

    static candidates = '/candidates';
    static candidateInfo = `${Endpoint.candidates}/me`;

    static members = '/members';
    static memberInfo = `${Endpoint.members}/me`;
    static groupInfo = `${Endpoint.members}/group`;
    static admin = `${Endpoint.members}/admin`;
}

export class RestClient {
    instance: AxiosInstance;

    constructor(public baseURL: string) {
        this.instance = axios.create({
            baseURL,
            validateStatus: () => true,
        });
    }

    addRequestInterceptor(
        onFulfilled: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
        onRejected?: (error: unknown) => unknown,
    ) {
        return this.instance.interceptors.request.use(onFulfilled, onRejected);
    }

    apiWrapper(toggleProgress: (on: boolean) => void, notify: (message: string, status: Status) => void) {
        return async <T>(
            action: () => Promise<AxiosResponse<R<T>>>,
            onSuccess: (data: T) => unknown,
            onFailure?: () => unknown,
        ) => {
            toggleProgress(true);
            try {
                const { data } = await action();
                toggleProgress(false);
                switch (data.status) {
                    case Status.info:
                    case Status.success:
                        await onSuccess(data.payload);
                        return true;
                    case Status.error:
                    case Status.warning:
                        notify(data.message, data.status);
                        await onFailure?.();
                }
            } catch ({ message }) {
                toggleProgress(false);
                notify(message as string, Status.error);
                await onFailure?.();
            }
            return false;
        };
    }

    // applications/

    createApplication(
        data: Pick<
            Application,
            'grade' | 'institute' | 'major' | 'rank' | 'group' | 'intro' | 'isQuick' | 'referrer'
        > & {
            resume: FileList | undefined;
            rid: string;
            code: string;
        },
        onUploadProgress: (event: ProgressEvent) => void,
    ) {
        const form = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof FileList) {
                form.append(key, value[0]);
            } else if (value !== undefined) {
                form.append(key, value.toString());
            }
        });
        return this.instance.post<R<Application>>(Endpoint.applications, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress,
        });
    }

    setApplication(
        aid: string,
        data: Pick<Application, 'grade' | 'institute' | 'major' | 'rank' | 'group' | 'intro' | 'referrer'> & {
            resume: FileList | undefined;
        },
        onUploadProgress: (event: ProgressEvent) => void,
    ) {
        const form = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof FileList) {
                form.append(key, value[0]);
            } else if (value !== undefined) {
                form.append(key, value.toString());
            }
        });
        return this.instance.put<R>(Endpoint.application(aid), form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress,
        });
    }

    abandonApplication(aid: string) {
        return this.instance.put<R>(Endpoint.abandoned(aid));
    }

    getInterviewSlots(aid: string, type: InterviewType) {
        return this.instance.get<R<Interview[]>>(Endpoint.slots(aid, type));
    }

    selectInterviewSlots(aid: string, type: InterviewType, iids: string[]) {
        return this.instance.put<R>(Endpoint.slots(aid, type), { iids });
    }

    allocateMany(type: InterviewType, aids: string[]) {
        return this.instance.put<R<{ aid: string; time?: string }[]>>(Endpoint.applicationAllocation(type), { aids });
    }

    allocateOne(type: InterviewType, aid: string, time: Date) {
        return this.instance.put<R>(Endpoint.applicationAllocation(type, aid), { time });
    }

    getApplications(rid: string, since: Date) {
        return this.instance.get<R<Application[]>>(Endpoint.applicationsInRecruitment(rid), {
            params: {
                updatedAt: +since,
            },
        });
    }

    moveApplication(id: string, from: Step, to: Step) {
        return this.instance.put<R>(Endpoint.step(id), { from, to });
    }

    removeApplication(id: string) {
        return this.instance.delete<R>(Endpoint.application(id));
    }

    getResume(id: string, onDownloadProgress: (event: ProgressEvent) => void) {
        return this.instance.get<Blob>(Endpoint.resume(id), {
            responseType: 'blob',
            onDownloadProgress,
        });
    }

    // recruitments/

    getPendingRecruitments() {
        return this.instance.get<R<Recruitment[]>>(Endpoint.pending);
    }

    getAllRecruitments() {
        return this.instance.get<R<Recruitment[]>>(Endpoint.recruitments);
    }

    getOneRecruitment(rid: string) {
        return this.instance.get<R<Recruitment>>(Endpoint.recruitment(rid));
    }

    createRecruitment(data: Pick<Recruitment, 'name' | 'beginning' | 'end' | 'deadline'> & Code) {
        return this.instance.post<R>(Endpoint.recruitments, data);
    }

    setRecruitmentSchedule(rid: string, data: Pick<Recruitment, 'beginning' | 'end' | 'deadline'>) {
        return this.instance.put<R>(Endpoint.schedule(rid), data);
    }

    setRecruitmentInterviews(
        rid: string,
        name: GroupOrTeam,
        interviews: Pick<Interview, 'date' | 'period' | 'slotNumber'>[],
    ) {
        return this.instance.put<R>(Endpoint.interviews(rid, name), { interviews });
    }

    // sms/

    getCodeForMember() {
        return this.instance.get<R>(Endpoint.verifyMember);
    }

    getCodeForCandidate() {
        return this.instance.get<R>(Endpoint.verifyCandidate);
    }

    getCodeForOther(phone: string) {
        return this.instance.get<R>(Endpoint.verifyOthers(phone));
    }

    sendSMSToCandidate(content: {
        type: SMSType;
        time?: string;
        place?: string;
        rest?: string;
        next: Step;
        aids: string[];
        code: string;
    }) {
        return this.instance.post<R>(Endpoint.sms, content);
    }

    // members/

    getGroupInfo() {
        return this.instance.get<R<Member[]>>(Endpoint.groupInfo);
    }

    getMemberInfo() {
        return this.instance.get<R<Member>>(Endpoint.memberInfo);
    }

    setMemberInfo(data: Pick<Member, 'mail' | 'phone' | 'password'>) {
        return this.instance.put<R>(Endpoint.memberInfo, data);
    }

    setGroupAdmin(mids: string[]) {
        return this.instance.put<R<string[]>>(Endpoint.admin, { mids });
    }

    // auth/

    getQRCode() {
        return this.instance.get<R<string>>(Endpoint.qrCode());
    }

    authMemberByQRCode(key: string) {
        return this.instance.get<R<string>>(Endpoint.qrCode(key));
    }

    authMemberByPassword(phone: string, password: string) {
        return this.instance.post<R<string>>(Endpoint.memberLogin, { phone, password });
    }

    authCandidateByPassword(phone: string, password: string) {
        return this.instance.post<R<string>>(Endpoint.candidateLogin, { phone, password });
    }

    // candidates/

    createCandidate(data: Pick<Candidate, 'name' | 'gender' | 'mail' | 'phone' | 'password'> & Code) {
        return this.instance.post<R>(Endpoint.candidates, data);
    }

    getCandidateInfo() {
        return this.instance.get<R<Candidate>>(Endpoint.candidateInfo);
    }

    setCandidateInfo(data: Optional<Pick<Candidate, 'mail' | 'phone' | 'password'>, 'password'>) {
        return this.instance.put<R>(Endpoint.candidateInfo, data);
    }
}

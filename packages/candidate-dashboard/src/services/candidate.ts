import { HOST } from 'config/consts';
import { Candidate, CandidateForm, MessageType, Time } from 'config/types';
import { getToken } from 'utils/token';
import { checkMail, checkPhone } from 'utils/validators';

const prefix = 'candidate';
const translator: Map<keyof CandidateForm, string> = new Map([
    ['name', '姓名'],
    ['mail', '邮箱'],
    ['institute', '学院'],
    ['major', '专业'],
    ['gender', '性别'],
    ['grade', '年级'],
    ['group', '组别'],
    ['rank', '成绩排名'],
    ['phone', '电话号码'],
    // ['code', '验证码'], we don't need code for dashboard
    ['intro', '自我介绍'],
]);

export interface LoginCandidateResp {
    type: MessageType;
    token?: string;
    message?: string;
}

export const loginCandidate: (phone: string, code: string) => Promise<LoginCandidateResp> = async (
    phone: string,
    code: string,
) => {
    const resp = await fetch(`${HOST}/${prefix}/login`, {
        method: 'POST',
        body: JSON.stringify({ phone, code }),
        headers: { 'Content-Type': 'application/json' },
    });
    const result: LoginCandidateResp = await resp.json();
    return result;
};

export interface SubmitCandidateFormResp {
    type: MessageType;
    message?: string;
}

export const submitCandidateForm: (candidateForm: CandidateForm, update?: boolean) => Promise<SubmitCandidateFormResp> =
    async (candidaiteForm, update = false) => {
        if (!checkMail(candidaiteForm.mail)) {
            return { type: 'warning', message: '邮箱格式不正确！' };
        }
        if (!checkPhone(candidaiteForm.phone)) {
            return { type: 'warning', message: '手机号码格式不正确！' };
        }
        // check if some fields are undefined
        for (const [key, value] of translator.entries()) {
            if (candidaiteForm[key] === undefined) {
                return { type: 'warning', message: `请填写${value}` };
            }
        }

        if (candidaiteForm.group === 'design' && !candidaiteForm.resume) {
            return { type: 'warning', message: '填报Design组需要上交作品集' };
        }
        if (candidaiteForm.resume instanceof FileList) {
            candidaiteForm.resume = candidaiteForm.resume[0];
        }
        const formData = new FormData();
        // number|boolean will be convert to string in formdata.
        // we need to use FormData as we need to upload file...
        // Todo: make this convert more clear
        Object.entries(candidaiteForm).forEach(([key, value]) => formData.append(key, value as string | File));

        const resp = await fetch(`${HOST}/${prefix}`, {
            method: update ? 'PUT' : 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        const result: SubmitCandidateFormResp = await resp.json();
        return result;
    };

export interface GetInterviewFormResp {
    type: MessageType;
    time?: Time[];
    token?: string;
    message?: string;
}

export interface GetCandidateInfoResp {
    data: Candidate;
    type: MessageType;
    message?: string;
}

export const getCandidateInfo = async () => {
    const resp = await fetch(`${HOST}/${prefix}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    return resp.json() as Promise<GetCandidateInfoResp>;
};

import type {
  AuthCode,
  LoginCandidateResp,
  SubmitCandidateFormResp,
  GetInterviewSlotsResp,
  GetCandidateInfoResp,
  SetCandidateInfo,
} from '@uniqs/api';
import { getToken } from 'utils/token';
import { checkMail } from 'utils/validators';

const HOST = process.env.HOST;
const prefix = 'candidate';
const translator: Map<keyof SetCandidateInfo, string> = new Map([
  ['name', '姓名'],
  ['mail', '邮箱'],
  ['institute', '学院'],
  ['major', '专业'],
  ['gender', '性别'],
  ['grade', '年级'],
  ['group', '组别'],
  ['rank', '成绩排名'],
  // ['phone', '电话号码'],
  // ['code', '验证码'], we don't need code for dashboard
  ['intro', '自我介绍'],
]);

export const loginCandidate: (data: AuthCode) => Promise<LoginCandidateResp> = async ({ phone, code }) => {
  try {
    const resp = await fetch(`${HOST}/${prefix}/login`, {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
      headers: { 'Content-Type': 'application/json' },
    });
    return await resp.json();
  } catch (error) {
    return { status: 'error', message: error?.message };
  }
};

export const submitCandidateForm: (
  form: SetCandidateInfo,
  update?: boolean,
) => Promise<SubmitCandidateFormResp> = async (form, update = false) => {
  try {
    if (!checkMail(form.mail)) {
      return { status: 'warning', message: '邮箱格式不正确！' };
    }
    // check if some fields are undefined
    for (const [key, value] of translator.entries()) {
      if (form[key] === undefined) {
        return { status: 'warning', message: `请填写${value}` };
      }
    }

    if (form.group === 'design' && !form.resume) {
      return { status: 'warning', message: '填报Design组需要上交作品集' };
    }
    if (form.resume instanceof FileList) {
      form.resume = form.resume[0];
    }
    const formData = new FormData();
    // number|boolean will be convert to string in formdata.
    // we need to use FormData as we need to upload file...
    // Todo: make this convert more clear
    Object.entries(form).forEach(([key, value]) => formData.append(key, value as string | File));

    const resp = await fetch(`${HOST}/${prefix}`, {
      method: update ? 'PUT' : 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return await resp.json();
  } catch (error) {
    return { status: 'error', message: error?.error };
  }
};

export const getInterviewSlots: () => Promise<GetInterviewSlotsResp<string>> = async () => {
  try {
    const resp = await fetch(`${HOST}/${prefix}/me/slots`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return await resp.json();
  } catch (error) {
    return { status: 'error', message: error?.message };
  }
};

export const getCandidateInfo: () => Promise<GetCandidateInfoResp> = async () => {
  try {
    const resp = await fetch(`${HOST}/${prefix}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return await resp.json();
  } catch (error) {
    return { status: 'error', message: error?.message };
  }
};

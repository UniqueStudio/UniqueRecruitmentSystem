import { SendSMSResp } from '@uniqs/api';

const HOST = process.env.HOST;
const prefix = 'sms';

export const getVerificationCode: (phone: string) => Promise<SendSMSResp> = async (phone) => {
  try {
    const resp = await fetch(`${HOST}/${prefix}/verification/candidate/${phone}`);
    return await resp.json();
  } catch (error) {
    return { status: 'error', message: error?.message };
  }
};

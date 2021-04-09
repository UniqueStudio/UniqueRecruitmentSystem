import { Status } from '@uniqs/config';

import { HOST } from 'config/consts';
const prefix = 'sms';

export interface GetVerificationCodeResp {
  type: Status;
  message?: string;
}

export const getVerificationCode: (phone: string) => Promise<GetVerificationCodeResp> = async (phone: string) => {
  const resp = await fetch(`${HOST}/${prefix}/verification/candidate/${phone}`);
  const result: GetVerificationCodeResp = await resp.json();
  return result;
};

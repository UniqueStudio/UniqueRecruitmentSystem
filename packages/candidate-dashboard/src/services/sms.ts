import { HOST } from 'config/consts';
import { MessageType } from 'config/types';

const prefix = 'sms';

export interface GetVerificationCodeResp {
  type: MessageType;
  message?: string;
}

export const getVerificationCode: (phone: string) => Promise<GetVerificationCodeResp> = async (phone: string) => {
  const resp = await fetch(`${HOST}/${prefix}/verification/candidate/${phone}`);
  const result: GetVerificationCodeResp = await resp.json();
  return result;
};

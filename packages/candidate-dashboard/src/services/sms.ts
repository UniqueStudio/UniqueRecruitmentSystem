import { HOST } from 'config/consts';
import { MessageType } from 'config/types';
import { checkPhone } from 'utils/validators';

const prefix = 'sms';

export interface GetVerificationCodeResp {
  type: MessageType;
  message?: string;
}

export const getVerificationCode: (phone: string) => Promise<GetVerificationCodeResp> = async (phone: string) => {
  if (!phone) {
    return { type: 'warning', message: '请填写手机号码！' };
  }
  if (!checkPhone(phone)) {
    return { type: 'warning', message: '手机号码格式不正确!' };
  }
  const resp = await fetch(`${HOST}/${prefix}/verification/candidate/${phone}`);
  const result: GetVerificationCodeResp = await resp.json();
  return result;
};

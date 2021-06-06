import { HOST } from 'config/consts';
import { MessageType } from 'config/types';

const prefix = 'sms';

export interface GetVerificationCodeResp {
    type: MessageType;
    message?: string;
}

export const getVerificationCode = async (phone: string) => {
    const resp = await fetch(`${HOST}/${prefix}/verification/candidate/${phone}`);
    return (await resp.json()) as GetVerificationCodeResp;
};

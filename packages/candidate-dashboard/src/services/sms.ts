import { SendSMSResp } from '@uniqs/api';
import { Status } from '@uniqs/config';

import { client, handleError } from './client';

export const getVerificationCode: (phone: string) => Promise<SendSMSResp> = async (phone) => {
    try {
        return await client(`sms/verification/candidate/${phone}`).json<SendSMSResp>();
    } catch (error: unknown) {
        return { status: Status.error, message: handleError(error) };
    }
};

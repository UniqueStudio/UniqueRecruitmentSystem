import { GetPendingTitlesResp } from '@uniqs/api';
import { Status } from '@uniqs/config';

import { client, handleError } from './client';

export const getPendingTitles: () => Promise<GetPendingTitlesResp<string>> = async () => {
    try {
        return await client('recruitment/pending').json<GetPendingTitlesResp<string>>();
    } catch (error) {
        return { status: Status.error, message: handleError(error) };
    }
};

import { GetPendingTitlesResp } from '@uniqs/api';

const HOST = process.env.HOST;
const prefix = 'recruitment';

export const getPendingTitles: () => Promise<GetPendingTitlesResp<string>> = async () => {
    try {
        const resp = await fetch(`${HOST}/${prefix}/pending`);
        return await resp.json();
    } catch (error) {
        return { status: 'error', message: error?.message };
    }
};

import ky from 'ky';

import { getToken } from 'utils/token';

export const HOST: string = process.env.HOST!;

export const client = ky.create({ prefixUrl: HOST });
export const authClient = client.extend({
    hooks: { beforeRequest: [(options) => options.headers.set('Authorization', `Bearer ${getToken()}`)] },
});

export const handleError = (error: unknown): string => {
    if (typeof error === 'string') {
        return error;
    } else if (error instanceof Error) {
        return error.message;
    }
    // FIXME: more case to cover
    return '网络错误';
};

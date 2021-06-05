import { verify } from 'jsonwebtoken';

import { secret } from '@config/consts';
import { FormPayload } from '@config/types';

export const extractJWT = (token?: string): FormPayload => {
    if (!token) {
        throw new Error('Missing token');
    }
    if (token.indexOf('Bearer ') === 0) {
        token = token.replace('Bearer ', '');
    }

    return verify(token, secret) as FormPayload;
};

export const verifyJWT = (token?: string) => {
    const { id } = extractJWT(token);
    return id;
};

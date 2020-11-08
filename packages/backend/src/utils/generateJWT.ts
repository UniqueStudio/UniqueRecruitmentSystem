import { sign } from 'jsonwebtoken';

import { secret } from '@config/consts';
import { Payload } from '@config/types';

export const generateJWT = (payload: Payload, expire: number) => {
    return sign(payload, secret, {
        expiresIn: expire,
    });
};

import jwt from 'jsonwebtoken';
import { secret } from '@config/consts';
import { Payload } from '@config/types';

export const generateJWT = (payload: Payload, expire: number) => {
    return jwt.sign(payload, secret, {
        expiresIn: expire
    });
};

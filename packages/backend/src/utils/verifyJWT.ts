import jwt from 'jsonwebtoken';
import { secret } from '../config/consts';
import { Payload } from '../config/types';

export const verifyJWT = (token: string) => {
    if (token.indexOf('Bearer ') === 0) {
        token = token.replace('Bearer ', '');
    }

    const { id } = jwt.verify(token, secret) as Payload;
    return id;
};

import jwt from 'jsonwebtoken';
import { secret } from './consts';

export const checkMail = (mail: string) => {
    const re = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return re.test(mail);
};

export const checkPhone = (phone: string) => {
    const re = /^((13[0-9])|(14[57])|(15[0-3,5-9])|166|(17[035678])|(18[0-9])|(19[89]))\d{8}$/i;
    return re.test(phone);
};

export const verifyJWT = (token?: string) => {
    if (!token) {
        throw new Error('No token provided');
    }
    if (token.indexOf('Bearer ') === 0) {
        token = token.replace('Bearer ', '');
    }
    return jwt.verify(token, secret) as object;
};

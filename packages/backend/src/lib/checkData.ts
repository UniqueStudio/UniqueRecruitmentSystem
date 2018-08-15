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

export const checkChinese = (data: string) => {
    const re = /^([\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d])+$/;
    return re.test(data);
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

import { RequestHandler } from 'express';

import { redisAsync } from '../redis';
import { isProd } from '../utils/environment';
import { errorRes } from '../utils/errorRes';

export const codeChecker = (type: 'user' | 'candidate'): RequestHandler => async (req, res, next) => {
    if (isProd()) {
        const { id } = res.locals;
        const { code, phone } = req.body;
        if (!code) {
            return next(errorRes('No validation code provided!', 'warning'));
        }
        if (type === 'user') {
            if (code !== await redisAsync.getThenDel(`userCode:${id}`)) {
                return next(errorRes('Validation code is incorrect!', 'warning'));
            }
        } else {
            if (!phone) {
                return next(errorRes('No phone number provided!', 'warning'));
            }
            if (code !== await redisAsync.getThenDel(`candidateCode:${phone}`)) {
                return next(errorRes('Validation code is incorrect!', 'warning'));
            }
        }
    }
    next();
};

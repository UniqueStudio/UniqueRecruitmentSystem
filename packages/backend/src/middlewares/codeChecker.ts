import { RequestHandler } from 'express';
import { redisAsync } from '../redis';
import { errorRes } from '../utils/errorRes';

export const codeChecker = (type: 'user' | 'candidate'): RequestHandler => async (req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        const { id } = res.locals;
        const { code } = req.body;
        if (!id || !code) {
            return next(errorRes('No validation code provided!', 'warning'));
        }
        if (code !== await redisAsync.getThenDel(`${type}Code:${id}`)) {
            return next(errorRes('Validation code is incorrect!', 'warning'));
        }
    }
    next();
};

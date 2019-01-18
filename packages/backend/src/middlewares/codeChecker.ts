import { RequestHandler } from 'express';
import { redisAsync } from '../redis';

export const codeChecker = (type: 'user' | 'candidate'): RequestHandler => async (req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        const { id } = res.locals;
        const { code } = req.body;
        if (!id || !code) {
            return next({ message: 'No validation code provided!', type: 'warning' });
        }
        if (code !== await redisAsync.getThenDel(`${type}Code:${id}`)) {
            return next({ message: 'Validation code is incorrect!', type: 'warning' });
        }
    }
    next();
};

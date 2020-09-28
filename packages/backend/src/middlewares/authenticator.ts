import { NextFunction, Request, Response } from 'express';
import { errorRes } from '@utils/errorRes';
import { verifyJWT } from '@utils/verifyJWT';

export const authenticator = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    const jwt = req.get('Authorization');
    if (!jwt) {
        return next(errorRes('No JWT provided!', 'warning'));
    }
    try {
        res.locals.id = verifyJWT(jwt);
        next();
    } catch (e) {
        return next(errorRes('JWT is invalid!', 'warning'));
    }
};

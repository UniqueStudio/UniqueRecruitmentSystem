import { NextFunction, Request, Response } from 'express';
import { verifyJWT } from '../utils/verifyJWT';

export const authenticator = (req: Request, res: Response, next: NextFunction) => {
    const jwt = req.get('Authorization');
    if (!jwt) {
        return next({ message: 'No JWT provided!', type: 'warning' });
    }
    try {
        res.locals.id = verifyJWT(jwt);
        next();
    } catch (e) {
        return next({ message: 'JWT is invalid!', type: 'warning' });
    }
};

import { Handler } from '@config/types';
import { errorRes } from '@utils/errorRes';
import { verifyJWT } from '@utils/verifyJWT';

export const authenticator: Handler = (req, res, next) => {
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

import { redisAsync } from '../redis';

import { Handler } from '@config/types';
import { isProd } from '@utils/environment';
import { errorRes } from '@utils/errorRes';

interface Body {
    code: string;
    phone: string;
}

export const codeChecker = (type: 'user' | 'candidate'): Handler<Body> => async (req, res, next) => {
    if (isProd) {
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

import crypto from 'crypto';

import { body, validationResult } from 'express-validator';

import { Handler } from '@config/types';
import { UserRepo } from '@database/model';
import { errorRes } from '@utils/errorRes';
import { generateJWT } from '@utils/generateJWT';

interface Body {
    phone: string;
    password: string;
}

export const handleLogin: Handler<Body> = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const { phone, password } = req.body;
        const user = (await UserRepo.query({ phone }))[0];
        if (!user) {
            return next(errorRes('User doesn\'t exist!', 'warning'));
        }
        if (!user.password) {
            return next(errorRes('Please set password first!', 'warning'));
        }
        const { hash, salt } = user.password;
        if (!hash || !salt) {
            return next(errorRes('Please set password first!', 'warning'));
        }
        if (hash !== crypto.scryptSync(password, salt, 64).toString()) {
            return next(errorRes('Password is incorrect!', 'warning'));
        }
        const token = generateJWT({ id: user._id.toString() }, 604800);
        res.json({ token, type: 'success' });
    } catch (error) {
        return next(error);
    }
};

export const handleLoginVerify = [
    body('phone').isMobilePhone('zh-CN').withMessage('Phone is invalid!'),
    body('password').isString().withMessage('Password is invalid!'),
];

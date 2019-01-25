import { RequestHandler } from 'express';
import { body, validationResult } from 'express-validator/check';
import { UserRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';

export const setInfo: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const id = res.locals.id;
        const user = await UserRepo.queryById(id);
        if (!user) {
            return next(errorRes('User doesn\'t exist!', 'warning'));
        }
        const { phone, mail } = req.body;
        await UserRepo.updateById(id, {
            phone,
            mail,
        });
        res.json({ type: 'success' });
    } catch (error) {
        return next(error);
    }
};

export const setInfoVerify = [
    body('mail').isEmail().withMessage('Mail is invalid!'),
    body('phone').isMobilePhone('zh-CN').withMessage('Phone is invalid!'),
];

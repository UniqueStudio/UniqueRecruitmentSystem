import { RequestHandler } from 'express';
import { body, validationResult } from 'express-validator/check';
import { UserRepo } from '../../database/model';

export const setInfo: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next({ message: errors.array(), type: 'warning' });
        }
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next({ message: 'User doesn\'t exist!', type: 'warning' });
        }
        const { phone, mail } = req.body;
        await UserRepo.update({ _id: user._id }, {
            phone,
            mail,
        });
        res.send({ type: 'success' });
    } catch (error) {
        return next(error);
    }
};

export const setInfoVerify = [
    body('mail').isEmail().withMessage('Mail is invalid!'),
    body('phone').isMobilePhone('zh-CN').withMessage('Phone is invalid!'),
];

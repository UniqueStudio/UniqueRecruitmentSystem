import { RequestHandler } from 'express';
import { body, param, validationResult } from 'express-validator/check';
import { RecruitmentRepo, UserRepo } from '../../database/model';

export const setRecruitment: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next({ message: errors.array(), type: 'warning' });
        }
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next({ message: 'User doesn\'t exist!', type: 'warning' });
        }
        const { isAdmin, isCaptain } = user;
        if (!isAdmin && !isCaptain) {
            return next({ message: 'Permission denied', type: 'warning' });
        }
        const title = req.params.title;
        const { begin, end, time1, time2 } = req.body;
        const data = { begin, end };
        time1 && (data['time1'] = time1);
        time2 && (data['time2'] = time2);
        await RecruitmentRepo.update(
            { title },
            data
        );
        res.send({ type: 'success' });
    } catch (error) {
        return next(error);
    }
};

export const setRecruitmentVerify = [
    param('title').matches(/\d{4}[ASC]/g).withMessage('Title is invalid!')
        .custom(async (title) => {
            const recruitment = (await RecruitmentRepo.query({ title }))[0];
            if (!recruitment) {
                throw new Error('Current recruitment doesn\'t exist!');
            }
            if (Date.now() < +recruitment.begin) {
                throw new Error('Current recruitment is not started!');
            }
            if (Date.now() > +recruitment.end) {
                throw new Error('Current recruitment has ended!');
            }
        }),
    body('begin').isString().withMessage('Begin time is invalid!')
        .custom((begin, { req }) => begin < req.body.end).withMessage('End time should be earlier than begin time'),
    body('end').isString().withMessage('End time is invalid!')
        .custom((end, { req }) => end > req.body.begin).withMessage('End time should be earlier than begin time'),
];

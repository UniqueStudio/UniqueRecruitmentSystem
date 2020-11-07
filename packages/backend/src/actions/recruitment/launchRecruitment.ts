import { RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';

import { io } from '../../app';
import { GROUPS_ } from '@config/consts';
import { RecruitmentRepo, UserRepo } from '@database/model';
import { errorRes } from '@utils/errorRes';

export const launchRecruitment: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next(errorRes('User doesn\'t exist!', 'warning'));
        }
        const { isAdmin, isCaptain } = user;
        if (!isAdmin && !isCaptain) {
            return next(errorRes('Permission denied', 'warning'));
        }
        const { title, begin, end, stop } = req.body;

        await RecruitmentRepo.createAndInsert({
            title,
            begin,
            end,
            stop,
            groups: GROUPS_.map((name) => ({ name })),
        });
        res.json({ type: 'success' });
        io.emit('updateRecruitment');
    } catch (error) {
        return next(error);
    }
};

export const launchRecruitmentVerify = [
    body('title').matches(/\d{4}[ASCO]/, 'g').withMessage('Title is invalid!').custom(async (title) => {
        if ((await RecruitmentRepo.query({ title })).length) {
            throw new Error('Current recruitment has already been launched!');
        }
    }),
    body('begin').isInt().withMessage('Begin time is invalid!')
        .custom((begin, { req }) => begin < req.body.stop).withMessage('Stop time should be later than begin time'),
    body('stop').isInt().withMessage('Stop time is invalid!')
        .custom((stop, { req }) => stop < req.body.end).withMessage('End time should be later than stop time'),
    body('end').isInt().withMessage('End time is invalid!')
        .custom((end, { req }) => end > req.body.begin).withMessage('End time should be later than begin time'),
];

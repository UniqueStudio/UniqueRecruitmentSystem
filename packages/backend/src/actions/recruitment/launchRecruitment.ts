import { body, validationResult } from 'express-validator';


import { GROUPS_, TITLE_REGEX } from '@config/consts';
import { Handler } from '@config/types';
import { RecruitmentRepo, UserRepo } from '@database/model';
import { io } from '@servers/websocket';
import { errorRes } from '@utils/errorRes';

interface Body {
    code: string;
    phone: string;
    title: string;
    begin: number;
    end: number;
    stop: number;
}

export const launchRecruitment: Handler<Body> = async (req, res, next) => {
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
    body('title').matches(TITLE_REGEX).withMessage('Title is invalid!').custom(async (title) => {
        if ((await RecruitmentRepo.query({ title })).length) {
            throw new Error('Current recruitment has already been launched!');
        }
    }),
    body('begin').isInt().withMessage('Begin time is invalid!')
        .custom((begin, { req: { body: { stop } } }) => begin < stop).withMessage('Stop time should be later than begin time'),
    body('stop').isInt().withMessage('Stop time is invalid!')
        .custom((stop, { req: { body: { end } } }) => stop < end).withMessage('End time should be later than stop time'),
    body('end').isInt().withMessage('End time is invalid!')
        .custom((end, { req: { body: { begin } } }) => end > begin).withMessage('End time should be later than begin time'),
];

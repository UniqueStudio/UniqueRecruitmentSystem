import { RequestHandler } from 'express';
import { body, param, validationResult } from 'express-validator/check';
import { RecruitmentRepo, UserRepo } from '../../database/model';
import { checkInterview } from '../../utils/checkInterview';
import { errorRes } from '../../utils/errorRes';

export const setRecruitment: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next(errorRes('User doesn\'t exist!', 'warning'));
        }
        const { isAdmin, isCaptain, group } = user;
        if (!isAdmin && !isCaptain) {
            return next(errorRes('Permission denied', 'warning'));
        }
        const title = req.params.title;
        const { begin, end, groupInterview, teamInterview } = req.body;
        if (teamInterview && teamInterview.length) {
            await RecruitmentRepo.update({ title }, {
                begin,
                end,
                interview: teamInterview
            });
        }
        if (groupInterview && groupInterview.length) {
            await RecruitmentRepo.update({
                title,
                'groups.name': group,
            }, {
                begin,
                end,
                'groups.$.interview': groupInterview
            });
        }
        return res.json({ type: 'success' });
    } catch (error) {
        return next(error);
    }
};

export const setRecruitmentVerify = [
    param('title').matches(/\d{4}[ASC]/, 'g').withMessage('Title is invalid!')
        .custom(async (title) => {
            const recruitment = (await RecruitmentRepo.query({ title }))[0];
            if (!recruitment) {
                throw new Error('Current recruitment doesn\'t exist!');
            }
            // if (Date.now() < recruitment.begin) {
            //     throw new Error('Current recruitment is not started!');
            // }
            // if (Date.now() > recruitment.end) {
            //     throw new Error('Current recruitment has ended!');
            // }
        }),
    body('begin').isInt().withMessage('Begin time is invalid!')
        .custom((begin, { req }) => begin < req.body.end).withMessage('End time should be earlier than begin time'),
    body('end').isInt().withMessage('End time is invalid!')
        .custom((end, { req }) => end > req.body.begin).withMessage('End time should be earlier than begin time'),
    body('teamInterview').custom(checkInterview).withMessage('Interview time is invalid!'),
    body('groupInterview').custom(checkInterview).withMessage('Interview time is invalid!'),
];

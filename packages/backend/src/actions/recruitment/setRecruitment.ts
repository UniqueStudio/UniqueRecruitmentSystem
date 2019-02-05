import { RequestHandler } from 'express';
import { body, param, validationResult } from 'express-validator/check';
import { io } from '../../app';
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
        const { isAdmin, isCaptain, group: userGroup } = user;
        if (!isAdmin && !isCaptain) {
            return next(errorRes('Permission denied', 'warning'));
        }
        const { title } = req.params;
        const { begin, end, groupInterview, teamInterview, group } = req.body;
        await RecruitmentRepo.update({ title }, {
            begin,
            end,
        });
        if (teamInterview && teamInterview.length) {
            await RecruitmentRepo.update({ title }, {
                interview: teamInterview
            });
        }
        if (groupInterview && groupInterview.length) {
            if (!group) {
                return next(errorRes('Group isn\'t specified!', 'warning'));
            }
            if (!isAdmin && group !== userGroup) {
                return next(errorRes('Permission denied', 'warning'));
            }
            await RecruitmentRepo.update({
                title,
                'groups.name': group,
            }, {
                'groups.$.interview': groupInterview
            });
        }
        io.emit('updateRecruitment');
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
            if (Date.now() > recruitment.end) {
                throw new Error('Current recruitment has ended!');
            }
        }),
    body('begin').isInt().withMessage('Begin time is invalid!')
        .custom((begin, { req }) => begin < req.body.end).withMessage('End time should be earlier than begin time'),
    body('end').isInt().withMessage('End time is invalid!')
        .custom((end, { req }) => end > req.body.begin).withMessage('End time should be earlier than begin time'),
    body('teamInterview').custom(checkInterview).withMessage('Interview time is invalid!'),
    body('groupInterview').custom(checkInterview).withMessage('Interview time is invalid!'),
];

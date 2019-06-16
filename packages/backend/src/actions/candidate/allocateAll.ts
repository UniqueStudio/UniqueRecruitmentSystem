import { RequestHandler } from 'express';
import { body, param, validationResult } from 'express-validator/check';
import { CandidateRepo, RecruitmentRepo, UserRepo } from '../../database/model';
import { allocateTime } from '../../utils/allocateTime';
import { errorRes } from '../../utils/errorRes';

export const allocateAll: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult<{ msg: string }>(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next(errorRes('User doesn\'t exist!', 'warning'));
        }
        const { group } = user;
        const { title } = req.body;
        const { type } = req.params;
        const recruitment = (await RecruitmentRepo.query({ title }))[0];
        if (type === 'group') {
            const groupData = recruitment.groups.find(({ name }) => name === group);
            if (!groupData) {
                return next(errorRes('Group doesn\'t exist!', 'warning'));
            }
            if (!groupData.interview.length) {
                return next(errorRes('Please set group interview time first!', 'warning'));
            }
            const candidates = await CandidateRepo.query({
                title,
                group,
                step: 2, // group interview
                abandon: false,
                rejected: false,
                // 'interviews.group.allocation': { $exists: false }, // not allocated
                'interviews.group.selection.0': { $exists: true }, // selected
            });
            const allocations = allocateTime(groupData.interview, candidates, 'group');
            const promises = allocations.map(async ({ id, time }) => {
                if (time) {
                    return await CandidateRepo.updateById(id, { 'interviews.group.allocation': time });
                }
                return;
            });
            Promise.all(promises).then(() => res.json({ type: 'success', allocations }));
        } else {
            if (!recruitment.interview.length) {
                return next(errorRes('Please set team interview time first!', 'warning'));
            }
            const candidates = await CandidateRepo.query({
                title,
                step: 4, // team interview
                abandon: false,
                rejected: false,
                // 'interviews.team.allocation': { $exists: false }, // not allocated
                'interviews.team.selection.0': { $exists: true }, // selected
            });
            const allocations = allocateTime(recruitment.interview, candidates, 'team');
            const promises = allocations.map(async ({ time, id }) => {
                if (time) {
                    return await CandidateRepo.updateById(id, { 'interviews.team.allocation': time });
                }
                return;
            });
            Promise.all(promises).then(() => res.json({ type: 'success', allocations }));
        }
    } catch (error) {
        return next(error);
    }
};

export const allocateAllVerify = [
    param('type').custom((type) => ['group', 'team'].includes(type)).withMessage('Interview type is invalid!'),
    body('title').matches(/\d{4}[ASC]/, 'g').withMessage('Title is invalid!')
        .custom(async (title) => {
            const recruitment = (await RecruitmentRepo.query({ title }))[0];
            if (!recruitment) {
                throw new Error('Current recruitment doesn\'t exist!');
            }
            if (Date.now() < recruitment.begin) {
                throw new Error('Current recruitment is not started!');
            }
            if (Date.now() > recruitment.end) {
                throw new Error('Current recruitment has ended!');
            }
        })
];

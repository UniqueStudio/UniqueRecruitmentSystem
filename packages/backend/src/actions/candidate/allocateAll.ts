import { param, validationResult } from 'express-validator';

import { verifyTitle } from './addCandidate';

import { Handler } from '@config/types';
import { CandidateRepo, RecruitmentRepo, UserRepo } from '@database/model';
import { allocateTime } from '@utils/allocateTime';
import { errorRes } from '@utils/errorRes';

interface Body {
    title: string;
}

export const allocateAll: Handler<Body> = async (req, res, next) => {
    try {
        const errors = validationResult(req);
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
        if (!recruitment) {
            return next(errorRes('Recruitment doesn\'t exist!', 'warning'));
        }
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
            await Promise.all(allocations.map(async ({ id, time }) => {
                if (time) {
                    return CandidateRepo.updateById(id, { 'interviews.group.allocation': time });
                }
                return;
            }));
            res.json({ type: 'success', allocations });
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
            await Promise.all(allocations.map(async ({ time, id }) => {
                if (time) {
                    return CandidateRepo.updateById(id, { 'interviews.team.allocation': time });
                }
                return;
            }));
            res.json({ type: 'success', allocations });
        }
    } catch (error) {
        return next(error);
    }
};

export const allocateAllVerify = [
    param('type').custom((type) => ['group', 'team'].includes(type)).withMessage('Interview type is invalid!'),
    verifyTitle,
];

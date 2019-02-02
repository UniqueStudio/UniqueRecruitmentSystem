import { RequestHandler } from 'express';
import { body, param, validationResult } from 'express-validator/check';
import { CandidateRepo, RecruitmentRepo } from '../../database/model';
import { checkInterview } from '../../utils/checkInterview';
import { errorRes } from '../../utils/errorRes';

export const setCandidate: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const { id } = res.locals;
        const candidate = await CandidateRepo.queryById(id);
        if (!candidate) {
            return next(errorRes('Candidate doesn\'t exist!', 'warning'));
        }
        const { interviews: { group, team }, rejected } = candidate;
        if (candidate.abandon) {
            return next(errorRes('You have already abandoned!', 'warning'));
        }
        if (rejected) {
            return next(errorRes('You are already rejected!', 'warning'));
        }
        const { teamInterview, groupInterview, abandon } = req.body;
        await CandidateRepo.updateById(id, {
            abandon: abandon || false
        });
        const { formId } = req.params;
        const type = formId.slice(-1);
        switch (type) {
            case '1': {
                const recruitmentId = formId.slice(0, -2);
                const recruitment = await RecruitmentRepo.queryById(recruitmentId);
                if (!recruitment) {
                    return next(errorRes('Recruitment doesn\'t exist！', 'warning'));
                }
                if (!groupInterview) {
                    return next(errorRes('Interview time is invalid!', 'warning'));
                }
                if (group.selection) {
                    return next(errorRes('You have already submitted!', 'warning'));
                }
                await CandidateRepo.updateById(id, {
                    'interview.group.selection': groupInterview,
                });
                return res.json({ type: 'success' });
            }
            case '2': {
                const recruitmentId = formId.slice(0, -1);
                const recruitment = await RecruitmentRepo.queryById(recruitmentId);
                if (!recruitment) {
                    return next(errorRes('Recruitment doesn\'t exist！', 'warning'));
                }
                if (!teamInterview) {
                    return next(errorRes('Interview time is invalid!', 'warning'));
                }
                if (team.selection) {
                    return next(errorRes('You have already submitted!', 'warning'));
                }
                await CandidateRepo.updateById(id, {
                    'interview.team.selection': teamInterview,
                });
                return res.json({ type: 'success' });
            }
            default: {
                return next(errorRes('Failed to set!', 'warning'));
            }
        }
    } catch (error) {
        return next(error);
    }
};

export const setCandidateVerify = [
    body('teamInterview').custom(checkInterview).withMessage('Interview time is invalid!'),
    body('groupInterview').custom(checkInterview).withMessage('Interview time is invalid!'),
    param('formId').isString().withMessage('URL is invalid!'),
];

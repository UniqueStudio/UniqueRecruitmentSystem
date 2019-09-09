import { RequestHandler } from 'express';
import { body, param, validationResult } from 'express-validator';
import { startSession } from 'mongoose';
import { CandidateRepo, RecruitmentRepo } from '../../database/model';
import { PayloadRepo } from '../../database/model';
import { redisAsync } from '../../redis';
import { checkInterview } from '../../utils/checkInterview';
import { errorRes } from '../../utils/errorRes';
import { sendSMS } from './sendSMS';

export const newSetCandidate: RequestHandler = async (req, res, next) => {
    const session = await startSession();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const { id } = res.locals; // from JWT
        const { teamInterview, groupInterview, abandon } = req.body;
        const hash = req.params.hash;
        const pid = await redisAsync.getThenDel(`payload:${hash}`);
        let payload = await PayloadRepo.queryById(pid);
        if (!payload) {
            payload = (await PayloadRepo.query({ hash }))[0];
            if (!payload) {
                return next(errorRes('Form doesn\'t exist!', 'warning'));
            }
        }
        const { id: cid, recruitmentId, step } = payload;
        if (id !== cid) {
            return next(errorRes('Candidate id is incorrect!', 'warning'));
        }
        const candidate = await CandidateRepo.queryById(id);
        if (!candidate) {
            return next(errorRes('Candidate doesn\'t exist!', 'warning'));
        }
        const { interviews: { group, team }, rejected, phone, name } = candidate;
        if (candidate.abandon) {
            return next(errorRes('You have already abandoned!', 'warning'));
        }
        if (rejected) {
            return next(errorRes('You are already rejected!', 'warning'));
        }
        if (abandon) {
            session.startTransaction();
            await Promise.all([
                CandidateRepo.updateById(id, {
                    abandon
                }, session),
                redisAsync.del(`payload:${hash}`)
            ]);
            await session.commitTransaction();
            return res.json({ type: 'success' });
        }
        switch (step) {
            case 'group': {
                const recruitment = await RecruitmentRepo.queryById(recruitmentId);
                if (!recruitment) {
                    return next(errorRes('Recruitment doesn\'t exist！', 'warning'));
                }
                if (recruitment.end < Date.now()) {
                    return next(errorRes('This recruitment has already ended!', 'warning'));
                }
                if (!groupInterview) {
                    return next(errorRes('Interview time is invalid!', 'warning'));
                }
                if (group.selection.length) {
                    return next(errorRes('You have already submitted!', 'warning'));
                }
                session.startTransaction();
                await Promise.all([
                    CandidateRepo.updateById(id, {
                        'interviews.group.selection': groupInterview,
                    }, session),
                    PayloadRepo.deleteById(pid),
                    // {1}你好，您当前状态是{2}，请关注手机短信以便获取后续通知。
                    sendSMS(phone, { template: 96388, param_list: [name, '成功选择组面时间'] })
                ]);
                await session.commitTransaction();
                return res.json({ type: 'success' });
            }
            case 'team': {
                const recruitment = await RecruitmentRepo.queryById(recruitmentId);
                if (!recruitment) {
                    return next(errorRes('Recruitment doesn\'t exist！', 'warning'));
                }
                if (recruitment.end < Date.now()) {
                    return next(errorRes('This recruitment has already ended!', 'warning'));
                }
                if (!teamInterview) {
                    return next(errorRes('Interview time is invalid!', 'warning'));
                }
                if (team.selection.length) {
                    return next(errorRes('You have already submitted!', 'warning'));
                }
                session.startTransaction();
                await Promise.all([
                    CandidateRepo.updateById(id, {
                        'interviews.team.selection': teamInterview,
                    }, session),
                    PayloadRepo.deleteById(pid),
                    // {1}你好，您当前状态是{2}，请关注手机短信以便获取后续通知。
                    sendSMS(phone, { template: 96388, param_list: [name, '成功选择群面时间'] })
                ]);
                await session.commitTransaction();
                return res.json({ type: 'success' });
            }
            default: {
                return next(errorRes('Failed to set!', 'warning'));
            }
        }
    } catch (error) {
        await session.abortTransaction();
        return next(error);
    }
};

export const newSetCandidateVerify = [
    body('teamInterview').custom(checkInterview).withMessage('Interview time is invalid!'),
    body('groupInterview').custom(checkInterview).withMessage('Interview time is invalid!'),
    param('hash').isString().withMessage('URL is invalid!'),
];

import { param, validationResult } from 'express-validator';

import { redisAsync } from '../../redis';

import { Handler } from '@config/types';
import { PayloadRepo, RecruitmentRepo } from '@database/model';
import { errorRes } from '@utils/errorRes';
import { generateJWT } from '@utils/generateJWT';

export const newGetForm: Handler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }

        const hash = req.params.hash;
        const payloadId = await redisAsync.get(`payload:${hash}`);
        if (!payloadId) {
            return next(errorRes('Payload ID doesn\'t exist!', 'warning'));
        }
        let payload = await PayloadRepo.queryById(payloadId);
        if (!payload) {
            payload = (await PayloadRepo.query({ hash }))[0];
            if (!payload) {
                return next(errorRes('Form doesn\'t exist!', 'warning'));
            }
        }
        const { id, recruitmentId, step, group: groupName } = payload;
        const token = generateJWT({ id }, 86400);

        switch (step) {
            case 'group': {
                // 组面
                const recruitment = await RecruitmentRepo.queryById(recruitmentId);
                if (!recruitment) {
                    return next(errorRes('Recruitment doesn\'t exist!', 'warning'));
                }
                const groupData = recruitment.groups.find((group) => group.name === groupName);
                if (!groupData) {
                    return next(errorRes('Group doesn\'t exist!', 'warning'));
                }
                return res.json({ type: 'success', time: groupData.interview, token, step });
            }
            case 'team': {
                // 群面
                const recruitment = await RecruitmentRepo.queryById(recruitmentId);
                if (!recruitment) {
                    return next(errorRes('Recruitment doesn\'t exist!', 'warning'));
                }
                return res.json({ type: 'success', time: recruitment.interview, token, step });
            }
            default: {
                return next(errorRes('Form doesn\'t exist!', 'warning'));
            }
        }
    } catch (error) {
        return next(error);
    }
};

export const newGetFormVerify = [
    param('hash').isString().withMessage('URL is invalid!'),
];

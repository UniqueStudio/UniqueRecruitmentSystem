import { RequestHandler } from 'express';
import { param, validationResult } from 'express-validator/check';
import fetch from 'node-fetch';

import { smsAPI, token } from '../../config/consts';
import { CandidateRepo } from '../../database/model';
import { redisAsync } from '../../redis';
import { errorRes } from '../../utils/errorRes';
import { getRandom } from '../../utils/getRandom';

export const sendCandidateCode: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const phone = req.params.phone;
        const code = getRandom(1000, 10000).toString();
        const response = await fetch(smsAPI, {
            method: 'POST',
            headers: {
                'Token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone,
                template: 185982,
                param_list: ['报名本次招新', code]
            })
        });
        const result = await response.json();
        if (result.code !== 200) {
            return next(errorRes(result.message, 'warning'));
        }
        await redisAsync.set(`candidateCode:${phone}`, code, 'EX', 600);
        res.json({ type: 'success' });
    } catch (error) {
        return next(error);
    }
};

export const sendCandidateCodeVerify = [
    param('phone').isMobilePhone('zh-CN').withMessage('Phone is invalid!'),
    param('phone').custom(async (phone) =>
        (await CandidateRepo.query({ phone })).length === 0
    ).withMessage('You have already applied!'),
];

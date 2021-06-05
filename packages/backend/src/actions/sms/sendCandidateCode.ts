import { param, validationResult } from 'express-validator';
import fetch from 'node-fetch';

import { redisAsync } from '../../redis';

import { smsAPI, token } from '@config/consts';
import { Handler } from '@config/types';
import { errorRes } from '@utils/errorRes';
import { getRandom } from '@utils/getRandom';

export const sendCandidateCode: Handler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const phone = req.params.phone;
        const verificationCode = getRandom(1000, 10000).toString();
        const response = await fetch(smsAPI, {
            method: 'POST',
            headers: {
                'Token': token,
                'Content-Type': 'application/json',
            },
            // 您{1}的验证码为：{2}，请于3分钟内填写。如非本人操作，请忽略本短信。
            body: JSON.stringify({
                phone,
                template: 719160,
                param_list: ['报名本次招新', verificationCode],
            }),
        });
        const { code, message } = await response.json();
        if (code !== 200) {
            return next(errorRes(message, 'warning'));
        }
        await redisAsync.set(`candidateCode:${phone}`, verificationCode, 'EX', 600);
        res.json({ type: 'success' });
    } catch (error) {
        return next(error);
    }
};

export const sendCandidateCodeVerify = [
    param('phone').isMobilePhone('zh-CN').withMessage('Phone is invalid!'),
];

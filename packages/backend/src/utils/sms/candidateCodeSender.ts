import { checkPhone } from '../../lib/checker';
import fetch from 'node-fetch';
import { smsSendURL, token } from '../../lib/consts';
import { redisClient } from '../../app';
import { Request, Response } from 'express';

export const candidateCodeSender = (req: Request, res: Response) => {
    (async () => {
        try {
            const phone = req.params.phone;
            if (!phone) {
                res.send({ message: '你未填写手机号码！', type: 'warning' });
                return;
            }
            if (!checkPhone(phone)) {
                res.send({ message: '手机号码格式不正确!', type: 'warning' });
                return;
            }
            let code = '';
            for (let i = 0; i < 4; i++) {
                code += ~~(Math.random() * 9); // '~~' (double NOT bitwise) operator is faster than Math.floor() in JavaScript
            }
            const response = await fetch(smsSendURL, {
                method: 'POST',
                headers: {
                    'Token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: phone,
                    template: 96385,
                    param_list: ["本次报名表单", code]
                })
            });
            const result = await response.json();
            if (result.code !== 200) {
                res.send({ message: '发送短信失败！', type: 'danger' });
                return;
            }
            redisClient.set(`candidateCode:${phone}`, code, 'EX', 600, () => {
                res.send({ type: 'success' });
            });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' });
        }
    })();
};
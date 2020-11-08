import fetch from 'node-fetch';

import { redisAsync } from '../../redis';

import { smsAPI, token } from '@config/consts';
import { Handler } from '@config/types';
import { UserRepo } from '@database/model';
import { errorRes } from '@utils/errorRes';
import { getRandom } from '@utils/getRandom';

export const sendUserCode: Handler = async (req, res, next) => {
    try {
        const { id: uid } = res.locals;
        const user = await UserRepo.queryById(uid);
        if (!user) {
            return next(errorRes('User doesn\'t exist!', 'warning'));
        }
        const phone = user.phone;
        if (!phone) {
            return next(errorRes('Phone number doesn\'t exist!', 'warning'));
        }
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
                param_list: ['dashboard中', verificationCode],
            }),
        });
        const { code, message } = await response.json();
        if (code !== 200) {
            return next(errorRes(message, 'warning'));
        }
        await redisAsync.set(`userCode:${uid}`, verificationCode, 'EX', 600);
        res.json({ type: 'success' });
    } catch (error) {
        return next(error);
    }
};

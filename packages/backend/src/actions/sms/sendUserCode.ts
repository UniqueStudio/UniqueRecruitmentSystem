import { RequestHandler } from 'express';
import fetch from 'node-fetch';
import { smsAPI, token } from '../../config/consts';
import { UserRepo } from '../../database/model';
import { redisAsync } from '../../redis';
import { errorRes } from '../../utils/errorRes';
import { getRandom } from '../../utils/getRandom';

export const sendUserCode: RequestHandler = async (req, res, next) => {
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
        const code = getRandom(1000, 10000).toString();
        const response = await fetch(smsAPI, {
            method: 'POST',
            headers: {
                'Token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone,
                template: 719160,
                param_list: ['在dashboard中当前', code]
            })
        });
        const result = await response.json();
        if (result.code !== 200) {
            return next(errorRes(result.message, 'warning'));
        }
        await redisAsync.set(`userCode:${uid}`, code, 'EX', 600);
        res.json({ type: 'success' });
    } catch (error) {
        return next(error);
    }
};

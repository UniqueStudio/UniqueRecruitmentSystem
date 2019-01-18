import { RequestHandler } from 'express';
import { ObjectId } from 'mongodb';
import { database } from '../../app';
import { allocateTime } from '../../utils/allocateTime';
import { verifyJWT } from '../../utils/verifyJWT';
import { GROUPS_, Recruitment, Time } from '../../config/consts';

export const setSlots: RequestHandler = async (req, res, next) => {
    try {
        verifyJWT(req.get('Authorization'));
        const { group, slots } = req.body;
        const title = req.params.title;
        if (!group || ![...GROUPS_, 'interview'].includes(group.toLowerCase())) {
            res.send({ message: '组别不正确!', type: 'warning' });
            return;
        }
        if (!slots) {
            res.send({ message: '未设置时间!', type: 'warning' });
            return;
        }
        if (!title) {
            res.send({ message: '未指定招新!', type: 'warning' });
            return;
        }
        let failed = 0;
        const recruitment: Recruitment = (await database.query('recruitments', { title }))[0];
        if (!recruitment) {
            res.send({ message: '招新不存在!', type: 'warning' });
            return;
        }
        if (group !== 'interview') {
            if (!recruitment.time1) {
                res.send({ message: '请先设置组面时间!', type: 'warning' });
                return;
            }
            await database.update('recruitments', { title }, recruitment.slot1 ? { [`slot1.${group}`]: slots } : { slot1: { [group]: slots } });
            const candidates = await database.query('candidates', {
                group,
                title,
                step: 2,
                abandon: false,
                rejected: false
            });
            const result = allocateTime(slots, candidates, 1, recruitment.time1[group].map((i: Time) => i.date));
            const promises = result.map(async (i) => {
                if (i['slot1']) {
                    await database.update('candidates', { _id: new ObjectId(i['_id']) }, { slot1: i['slot1'] });
                } else {
                    failed++;
                }
            });
            Promise.all(promises).then(() => {
                res.send({ type: 'success', result, failed, interview: 1 });
            });
        } else {
            if (!recruitment.time2) {
                res.send({ message: '请先设置群面时间!', type: 'warning' });
                return;
            }
            await database.update('recruitments', { title }, { slot2: slots });
            const candidates = await database.query('candidates', {
                title,
                step: 4,
                abandon: false,
                rejected: false
            });
            const result = allocateTime(slots, candidates, 2, recruitment.time2.map((i) => i.date));
            const promises = result.map(async (i) => {
                if (i['slot2']) {
                    await database.update('candidates', { _id: new ObjectId(i['_id']) }, { slot2: i['slot2'] });
                } else {
                    failed++;
                }
            });
            Promise.all(promises).then(() => {
                res.send({ type: 'success', result, failed, interview: 2 });
            });
        }
    } catch (error) {
        return next(error);
    }
};

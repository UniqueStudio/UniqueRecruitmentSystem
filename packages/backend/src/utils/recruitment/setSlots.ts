import { Request, Response } from 'express';
import { verifyJWT } from '../../lib/checkData';
import { arrangeTime } from '../../lib/arrangeTime';
import { database } from '../../app';
import { ObjectId } from 'mongodb';

export const setSlots = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const { group, slots, title } = req.body;
            let failed = 0;
            if (group !== 'interview') {
                await database.update('recruitments', { title }, { [`time1.slots.${group}`]: slots });
                const candidates = await database.query('candidates', { group, title, step: 2, abandon: false });
                const result = arrangeTime(slots, candidates, 1);
                const promises = result.map(async i => {
                    if (i['slot1']) {
                        await database.update('candidates', { _id: new ObjectId(i['_id']) }, { slot1: i['slot1'] })
                    } else {
                        failed++;
                    }
                });
                Promise.all(promises).then(() => {
                    res.send({ type: 'success', result, failed, interview: 1 });
                })
            } else {
                await database.update('recruitments', { title }, { slots });
                const candidates = await database.query('candidates', { title, step: 4, abandon: false });
                const result = arrangeTime(slots, candidates, 2);
                const promises = result.map(async i => {
                    if (i['slot2']) {
                        await database.update('candidates', { _id: new ObjectId(i['_id']) }, { slot2: i['slot2'] })
                    } else {
                        failed++;
                    }
                });
                Promise.all(promises).then(() => {
                    res.send({ type: 'success', result, failed, interview: 2 });
                })
            }
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })();
};
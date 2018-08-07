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
            if (group !== 'interview') {
                await database.update('recruitments', { title }, { [`time1.${group}.slots`]: slots });
                const candidates = await database.query('candidates', { group, title, step: 2, abandon: false });
                const result = arrangeTime(slots, candidates, 1);
                result.map(async i => {
                    await database.update('candidates', { _id: new ObjectId(i['_id']) }, { slot1: i['slot1'] })
                })
            } else {
                await database.update('recruitments', { title }, { slots });
                const candidates = await database.query('candidates', { title, step: 4, abandon: false });
                const result = arrangeTime(slots, candidates, 2);
                result.map(async i => {
                    await database.update('candidates', { _id: new ObjectId(i['_id']) }, { slot2: i['slot2'] })
                })
            }
            res.send({ type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })();
};
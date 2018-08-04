import { verifyJWT } from '../../lib/checker';
import { ObjectId } from 'mongodb';
import { database } from '../../app';
import { Request, Response } from 'express';

export const candidateSetter = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const candidateResult = (await database.query('candidates', { _id: new ObjectId(req.params.cid) }))[0];
            if ((candidateResult.time1 && req.body.patch.time1)
                || (candidateResult.time2 && req.body.patch.time2)
            || candidateResult.abandon) {
                res.send({ message: '不能重复提交!', type: 'warning' });
                return;
            }
            await database.update('candidates', { _id: new ObjectId(req.params.cid) }, req.body.patch);
            res.send({ type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })();
};
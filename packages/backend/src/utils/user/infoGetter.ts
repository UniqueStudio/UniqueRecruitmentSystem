import { verifyJWT } from '../../lib/checker';
import { ObjectId } from 'mongodb';
import { database } from '../../app';
import { Request, Response } from 'express';

export const infoGetter = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const userInfo = await database.query('users', { _id: new ObjectId(req.params.uid) });
            res.send({ data: userInfo[0], type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' });
        }
    })()
};
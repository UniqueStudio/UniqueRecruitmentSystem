import { Request, Response } from 'express';
import { verifyJWT } from '../../lib/checker';
import { database } from '../../app';
import { ObjectId } from 'mongodb';

export const groupGetter = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const groupUsers = await database.query('users', { group: new ObjectId(req.params.group) });
            res.send({ data: groupUsers, type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' });
        }
    })()
};
import { Request, Response } from 'express';
import { verifyJWT } from '../../lib/checkData';
import { database } from '../../app';

export const getGroup = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const groupUsers = await database.query('users', { group: req.params.group });
            res.send({ data: groupUsers, type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' });
        }
    })()
};
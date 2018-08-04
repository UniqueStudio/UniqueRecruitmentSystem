import { verifyJWT } from '../../lib/checker';
import { database } from '../../app';
import { Request, Response } from 'express';

export const recruitmentGetterOne = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const data = await database.query('recruitments', { title: req.params.title });
            res.send({ data: data[0], type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' });
        }
    })();
};
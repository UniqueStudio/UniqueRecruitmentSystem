import { verifyJWT } from '../../lib/checkData';
import { database } from '../../app';
import { Request, Response } from 'express';

export const getOneRecruitment = (req: Request, res: Response) => {
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
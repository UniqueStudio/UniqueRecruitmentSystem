import { verifyJWT } from '../../lib/checkData';
import { database } from '../../app';
import { Request, Response } from 'express';

export const getAllRecruitments = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const data = await database.query('recruitments', {});
            res.send({ data: data, type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' });
        }
    })();
};
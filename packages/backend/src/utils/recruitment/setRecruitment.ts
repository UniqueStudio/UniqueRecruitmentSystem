import { Request, Response } from 'express';
import { verifyJWT } from '../../lib/checkData';
import { database } from '../../app';

export const setRecruitment = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const title = req.params.title;
            const { begin, end, time1, time2 } = req.body;
            if (!title) {
                res.send({ message: '未指定招新!', type: 'warning' });
                return;
            }
            await database.update('recruitments',
                { title },
                { time1, time2, begin, end }
            );
            res.send({ type: 'success' })
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })();
}
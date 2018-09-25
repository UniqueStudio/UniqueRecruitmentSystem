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
            const data = { begin, end };
            time1 && (data['time1'] = time1);
            time2 && (data['time2'] = time2);
            await database.update('recruitments',
                { title },
                data
            );
            res.send({ type: 'success' })
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })();
};
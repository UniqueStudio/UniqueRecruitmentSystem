import { verifyJWT } from '../../lib/checker';
import { GROUPS as groups } from '../../lib/consts';
import { database, getAsync, io, redisClient } from '../../app';
import { Request, Response } from 'express';

export const recruitmetnLauncher = (req: Request, res: Response) => {
    (async () => {
        try {
            const { title, begin, end, code } = req.body;
            const decoded = verifyJWT(req.get('Authorization'));
            const userCode = await getAsync(`userCode:${decoded['uid']}`);
            if (userCode === code) {
                await database.insert('recruitments', {
                    title, begin, end,
                    data: groups.map(i => ({ group: i, total: 0, steps: [0, 0, 0, 0, 0, 0] })),
                    total: 0,
                });
                res.send({ type: 'success' });
                io.emit('updateRecruitment');
                redisClient.del(`userCode:${decoded['uid']}`);
            } else {
                res.send({ message: '验证码错误', type: 'warning' });
                return;
            }
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })();
};
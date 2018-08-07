import { verifyJWT } from '../../lib/checkData';
import { GROUPS as groups } from '../../lib/consts';
import { database, getAsync, io, redisClient } from '../../app';
import { Request, Response } from 'express';

export const launchRecruitment = (req: Request, res: Response) => {
    (async () => {
        try {
            const { title, begin, end, code } = req.body;
            const decoded = verifyJWT(req.get('Authorization'));
            const userCode = await getAsync(`userCode:${decoded['uid']}`);
            if (userCode === code) {
                const queryResult = await database.query('recruitments', {title});
                if (queryResult.length) {
                    res.send({ message: '不能重复发起招新', type: 'warning' });
                    return;
                }
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
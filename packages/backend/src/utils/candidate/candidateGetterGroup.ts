import { verifyJWT } from '../../lib/checker';
import { Candidate } from '../../lib/consts';
import { database } from '../../app';
import { Request, Response } from 'express';

export const candidateGetterGroup = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const title = req.params.title;
            const group = req.params.group;
            let data;
            const formatted = [{}, {}, {}, {}, {}, {}];
            if (title) {
                data = await database.query('candidates', { title, group });
            } else {
                const pendingRecruitments = await database.query('recruitments', { end: { $gt: +new Date() } });
                if (pendingRecruitments.length === 0) {
                    res.send({ data: formatted, type: 'info', message: '没有正在进行的招新' });
                    return;
                }
                data = await database.query('candidates', { title: pendingRecruitments[0].title, group });
            }
            data.map((i: Candidate) => formatted[i.step][`${i._id}`] = { ...i, resume: '' }); // hide resume path
            res.send({ data: formatted, type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })();
};
import { verifyJWT } from '../../lib/checkData';
import { Candidate } from '../../lib/consts';
import { database } from '../../app';
import { Request, Response } from 'express';

export const getGroupCandidates = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const title = req.params.title;
            const group = req.params.group;
            let data;
            const formatted = [{}, {}, {}, {}, {}, {}];
            if (title) {
                data = await database.query('candidates', { title, group });
                data.map((i: Candidate) => formatted[i.step][`${i._id}`] = { ...i, resume: '' }); // hide resume path
                res.send({ data: formatted, type: 'success' });
            } else {
                const pendingRecruitments = await database.query('recruitments', { end: { $gt: +new Date() } });
                if (pendingRecruitments.length === 0) {
                    res.send({ data: formatted, type: 'info', message: '没有正在进行的招新' });
                    return;
                }
                if (group === 'interview') {
                    data = await database.query('candidates', { title: pendingRecruitments[0].title, step: { $gt: 3 } });
                } else {
                    data = await database.query('candidates', { title: pendingRecruitments[0].title, group });
                }
                data.map((i: Candidate) => formatted[i.step][`${i._id}`] = { ...i, resume: '' }); // hide resume path
                res.send({ data: formatted, type: 'success', title: pendingRecruitments[0].title });
            }
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })();
};
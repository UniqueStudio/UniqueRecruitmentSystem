import { Request, Response } from 'express';
import { verifyJWT } from '../../lib/checkData';
import { database } from '../../app';
import { Candidate } from '../../lib/consts';

export const getStepCandidates = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const title = req.params.title;
            const step = req.params.step;
            let data;
            const formatted = {};
            if (title) {
                data = await database.query('candidates', { title, step });
                data.map((i: Candidate) => formatted[`${i._id}`] = { ...i, resume: '' }); // hide resume path
                res.send({ data: formatted, type: 'success' });
            } else {
                const pendingRecruitments = await database.query('recruitments', { end: { $gt: +new Date() } });
                if (pendingRecruitments.length === 0) {
                    res.send({ data: formatted, type: 'info', message: '没有正在进行的招新' });
                    return;
                }
                data = await database.query('candidates', { title: pendingRecruitments[0].title, step });
                data.map((i: Candidate) => formatted[`${i._id}`] = { ...i, resume: '' }); // hide resume path
                res.send({ data: formatted, type: 'success', title: pendingRecruitments[0].title });
            }
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })();
};
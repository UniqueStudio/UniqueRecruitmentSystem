import { verifyJWT } from '../../lib/checkData';
import { Candidate } from '../../lib/consts';
import { database } from '../../app';
import { Request, Response } from 'express';

export const getAllCandidates = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const title = req.params.title;
            let data;
            const formatted = [{}, {}, {}, {}, {}, {}];
            if (title) {
                data = await database.query('candidates', { title });
            } else {
                const pendingRecruitments = await database.query('recruitments', { end: { $gt: +new Date() } });
                if (pendingRecruitments.length === 0) {
                    res.send({ data: formatted, type: 'info', message: '没有正在进行的招新' });
                    return;
                }
                data = await database.query('candidates', { title: pendingRecruitments[0].title });
            }
            data.map((i: Candidate) => formatted[i.step][`${i._id}`] = { ...i, resume: '' }); // hide resume path
            res.send({ data: formatted, type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })();
};
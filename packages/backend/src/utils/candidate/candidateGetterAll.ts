import { verifyJWT } from '../../lib/checker';
import { Candidate } from '../../lib/consts';
import { database } from '../../app';
import { Request, Response } from 'express';

export const candidateGetterAll = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const title = req.params.title;
            let data;
            if (title) {
                data = await database.query('candidates', {title});
            } else {
                data = await database.query('candidates', {});
            }
            const formatted = [{}, {}, {}, {}, {}, {}];
            data.map((i: Candidate) => formatted[i.step][`${i._id}`] = { ...i, resume: '' }); // hide resume path
            res.send({ data: formatted, type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })();
};
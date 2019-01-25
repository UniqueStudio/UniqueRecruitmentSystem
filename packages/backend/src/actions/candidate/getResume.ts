import { RequestHandler } from 'express';
import { basename, resolve } from 'path';
import { CandidateRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';

export const getResume: RequestHandler = async (req, res) => {
    try {
        const data = await CandidateRepo.queryById(req.params.cid);
        if (!data || !data.resume) {
            res.status(404).send(errorRes('简历不存在！', 'warning'));
        } else {
            const path = resolve(data.resume);
            const filename = Buffer.from(basename(path)).toString('base64');
            res.set({
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Access-Control-Expose-Headers': 'Content-Disposition',
            }).sendFile(path);
        }
    } catch (err) {
        res.status(500).send(errorRes(err.message, 'error'));
    }
};

import { RequestHandler } from 'express';
import { basename } from 'path';
import { CandidateRepo } from '../../database/model';

export const getResume: RequestHandler = async (req, res, next) => {
    try {
        const data = await CandidateRepo.queryById(req.params.cid);
        if (!data || !data.resume) {
            res.status(404).send({ message: '简历不存在！', type: 'warning' });
        } else {
            const filename = Buffer.from(basename(data.resume)).toString('base64');
            res.set({
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Access-Control-Expose-Headers': 'Content-Disposition',
            }).sendFile(data.resume);
        }
    } catch (err) {
        res.status(500).send({ message: err.message, type: 'danger' });
    }
};

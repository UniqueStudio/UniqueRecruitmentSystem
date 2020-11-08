import { basename, resolve } from 'path';

import { Handler } from '@config/types';
import { CandidateRepo } from '@database/model';
import { errorRes } from '@utils/errorRes';

export const getResume: Handler = async (req, res) => {
    try {
        const data = await CandidateRepo.queryById(req.params.cid);
        if (!data || !data.resume) {
            res.status(404).send(errorRes('简历不存在！', 'warning'));
        } else {
            const path = resolve(data.resume);
            const filename = Buffer.from(basename(path)).toString('base64');
            res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Disposition')
                .download(path, filename);
        }
    } catch ({ message }) {
        res.status(500).send(errorRes(message, 'error'));
    }
};

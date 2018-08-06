import { verifyJWT } from '../../lib/checkData';
import { ObjectId } from 'mongodb';
import { database } from '../../app';
import { Request, Response } from 'express';


export const getResume = (req: Request, res: Response) => {
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            const data = await database.query('candidates', { _id: new ObjectId(req.params.cid) });
            if (!data[0].resume) {
                res.status(404).send({ message: '简历不存在！', type: 'warning' });
            } else {
                const filename = Buffer.from(data[0].resume.replace(/^\/www\/resumes\/\w+\/\w+\//, '')).toString('base64');
                res.set({
                    'Content-Disposition': `attachment; filename="${filename}"`,
                    'Access-Control-Expose-Headers': 'Content-Disposition',
                }).sendFile(data[0].resume);
            }
        } catch (err) {
            res.status(500).send({ message: err.message, type: 'danger' })
        }
    })();
};
import jwt from 'jsonwebtoken';
import { GROUPS as groups, secret } from '../../lib/consts';
import { ObjectId } from 'mongodb';
import { database } from '../../app';
import { Request, Response } from 'express';


export const getForm = (req: Request, res: Response) => {
    const formId = req.params.formId;
    if (!formId) {
        res.send({ message: 'URL不正确！', type: 'warning' });
        return;
    }
    const type = +formId.slice(-1);
    const cid = req.params.cid;
    if (!cid) {
        res.send({ message: 'URL不正确！', type: 'warning' });
        return;
    }
    const token = jwt.sign({ cid }, secret, {
        expiresIn: 86400
    });
    (async () => {
        try {
            if (type === 1) { // interview 1
                const groupId = +formId.slice(-2, -1);
                const group = groups[groupId];
                const recruitmentId = formId.slice(0, -2);
                const recruitment = (await database.query('recruitments', { _id: new ObjectId(recruitmentId) }))[0];
                res.send({ type: 'success', time: recruitment.time1[group], token });
            } else if (type === 2) { // interview 2
                const recruitmentId = formId.slice(0, -1);
                const recruitment = (await database.query('recruitments', { _id: new ObjectId(recruitmentId) }))[0];
                res.send({ type: 'success', time: recruitment.time2, token });
            } else {
                res.send({ message: '表单不存在！', type: 'warning' });
            }
        } catch (err) {
            res.send({ message: err.message, type: 'danger' });
        }
    })()
};
import { checkMail, checkPhone, verifyJWT } from '../../lib/checker';
import { ObjectId } from 'mongodb';
import { database } from '../../app';
import { Request, Response } from 'express';

export const infoChanger = (req: Request, res: Response) => {
    const body = req.body;
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            if (Object.values(body).includes('')) {
                res.send({ message: '请完整填写信息!', type: 'warning' });
                return;
            }
            if (!checkMail(body.mail)) {
                res.send({ message: '邮箱格式不正确!', type: 'warning' });
                return;
            }
            if (!checkPhone(body.phone)) {
                res.send({ message: '手机号码格式不正确!', type: 'warning' });
                return;
            }
            await database.update('users', { _id: new ObjectId(req.params.uid) }, {
                username: body.username,
                joinTime: body.joinTime,
                isCaptain: Boolean(body.isCaptain),
                isAdmin: Boolean(body.isAdmin),
                phone: body.phone,
                mail: body.mail,
                sex: body.sex,
                group: body.group,
            });
            res.send({ type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' });
        }
    })()
};
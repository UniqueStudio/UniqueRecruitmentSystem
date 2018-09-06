import { checkChinese, checkMail, checkPhone, verifyJWT } from '../../lib/checkData';
import { ObjectId } from 'mongodb';
import { database } from '../../app';
import { Request, Response } from 'express';
import { GROUPS } from '../../lib/consts';

export const changeInfo = (req: Request, res: Response) => {
    const body = req.body;
    const { username, joinTime, isCaptain, isAdmin, phone, mail, sex, group } = body;
    (async () => {
        try {
            verifyJWT(req.get('Authorization'));
            if ([username, joinTime, isCaptain, isAdmin, phone, mail, sex, group].includes('')
                || [username, joinTime, isCaptain, isAdmin, phone, mail, sex, group].includes(undefined)) {
                res.send({ message: '请完整填写信息', type: 'warning' });
                return;
            }
            if (!checkMail(mail)) {
                res.send({ message: '邮箱格式不正确!', type: 'warning' });
                return;
            }
            if (!checkPhone(phone)) {
                res.send({ message: '手机号码格式不正确!', type: 'warning' });
                return;
            }
            if (!GROUPS.includes(group.toLowerCase())) {
                res.send({ message: '组别不正确!', type: 'warning' });
                return;
            }
            if (!checkChinese(username)) {
                res.send({ message: '姓名必须为中文!', type: 'warning' });
                return;
            }
            if (!["Male", "Female"].includes(sex)) {
                res.send({ message: '性别不正确!', type: 'warning' });
                return;
            }
            if (typeof isCaptain !== 'boolean') {
                res.send({ message: '是否组长不正确!', type: 'warning' });
                return;
            }
            if (typeof isAdmin !== 'boolean') {
                res.send({ message: '是否管理员不正确!', type: 'warning' });
                return;
            }
            await database.update('users', { _id: new ObjectId(req.params.uid) }, {
                username,
                joinTime,
                isCaptain: Boolean(isCaptain),
                isAdmin: Boolean(isAdmin),
                phone,
                mail,
                sex,
                group,
            });
            res.send({ type: 'success' });
        } catch (err) {
            res.send({ message: err.message, type: 'danger' });
        }
    })()
};
import { checkChinese, checkMail, checkPhone } from '../../lib/checkData';
import { ObjectId } from 'mongodb';
import { database, io, redisClient, getAsync } from '../../app';
import { Request, Response } from 'express';
import { GRADES, GROUPS, SCORES } from '../../lib/consts';
import { deleteFile } from '../../lib/deleteFile';

export const addCandidate = (req: Request, res: Response) => {
    const body = req.body;
    const { name, grade, institute, major, score, mail, phone, group, sex, intro, title, isQuick, code: userCode } = body;
    (async () => {
        try {
            const filename = req.file ? `/www/resumes/${title}/${group}/${name} - ${req.file.originalname}` : '';
            let candidateResult = await database.query('candidates', { name, phone });
            if ([name, grade, institute, major, score, mail, phone, group, sex, intro, title, isQuick, userCode].includes(undefined)
                || [name, grade, institute, major, score, mail, phone, group, sex, intro, title, isQuick, userCode].includes('')
            ) {
                res.send({ message: '请完整填写表单!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (candidateResult.length !== 0) {
                res.send({ message: '不能重复报名!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            const recruitment = (await database.query('recruitments', { title }))[0];
            if (!recruitment) {
                res.send({ message: '当前招新不存在!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (+new Date() < recruitment.begin) {
                res.send({ message: '当前招新未开始!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (+new Date() > recruitment.end) {
                res.send({ message: '当前招新已结束!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (!checkMail(mail)) {
                res.send({ message: '邮箱格式不正确!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (!checkPhone(phone)) {
                res.send({ message: '手机号码格式不正确!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (!checkChinese(name)) {
                res.send({ message: '姓名必须为中文!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (!checkChinese(institute)) {
                res.send({ message: '学院必须为中文!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (!checkChinese(major)) {
                res.send({ message: '专业必须为中文!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (!["Male", "Female"].includes(sex)) {
                res.send({ message: '性别不正确!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (!['0', '1'].includes(isQuick)) {
                res.send({ message: '是否快通不正确!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (!GRADES.includes(grade)) {
                res.send({ message: '年级不正确!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (!GROUPS.includes(group.toLowerCase())) {
                res.send({ message: '组别不正确!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            if (!SCORES.includes(score)) {
                res.send({ message: '排名不正确!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            const code = await getAsync(`candidateCode:${phone}`);
            if (code !== userCode) {
                res.send({ message: '验证码不正确!', type: 'warning' });
                deleteFile(filename);
                return;
            }
            const cid = await database.insert('candidates', {
                name,
                grade,
                institute,
                major,
                score,
                mail,
                phone,
                group,
                sex,
                step: 0,
                intro,
                isQuick: Boolean(+isQuick),
                title,
                comments: {},
                abandon: false,
                rejected: false,
                resume: filename
            });

            const data = recruitment['data'].map((i: object) => {
                if (i['group'] === group) {
                    if (i['total'] === undefined) i['total'] = 0;
                    i['total'] += 1;
                    if (!i['steps']) i['steps'] = [0, 0, 0, 0, 0, 0];
                    i['steps'][0] += 1;
                }
                return i;
            });
            await database.update('recruitments', { title }, {
                data,
                total: recruitment['total'] ? recruitment['total'] + 1 : 1
            });
            res.send({ type: 'success' });
            candidateResult = await database.query('candidates', { _id: new ObjectId(cid) });
            io.emit('addCandidate', candidateResult[0]);
            io.emit('updateRecruitment');
            redisClient.del(`candidateCode:${phone}`);
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })()
};
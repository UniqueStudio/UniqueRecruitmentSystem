import { verifyJWT } from '../../lib/checkData';
import { GROUPS as groups, smsSendURL, token } from '../../lib/consts';
import { ObjectId } from 'mongodb';
import { generateModel } from '../../lib/generateModel';
import fetch from 'node-fetch';
import { database, redisClient } from '../../app';
import { Request, Response } from 'express';

export const sendCommon = (req: Request, res: Response) => {
    const body = req.body;
    const { step, type, group, title, candidates } = body;
    (async () => {
        try {
            const decoded = verifyJWT(req.get('Authorization'));
            const recruitment = (await database.query('recruitments', { title }))[0];
            let formId = '';
            if (body.date) {
                if (step === '笔试流程') {
                    formId = `${recruitment['_id']}${groups.indexOf(group)}1`;
                    await database.update('recruitments',
                        { title },
                        { time1: { ...recruitment.time1, [group]: body.date } }
                    );
                } else if (step === '熬测流程') {
                    formId = `${recruitment['_id']}2`;
                    await database.update('recruitments', { title }, { time2: body.date });
                }
            }
            //const code = await getAsync(`userCode:${decoded['uid']}`);
            if (/*body.code === code*/ true) {
                const results = candidates.map(async (i: string) => {
                    const candidateInfo = (await database.query('candidates', { _id: new ObjectId(i) }))[0];
                    if (type === 'reject') {
                        await database.update('candidates', { _id: new ObjectId(i) }, { rejected: true })
                    }
                    let model = generateModel(candidateInfo['name'], step, type, group);
                    if (body.date) {
                        model += `http://cvs.hustunique.com/form/${formId}/${i}`;
                    }
                    console.log(model);
                    const response = await fetch(smsSendURL, {
                        method: 'POST',
                        headers: {
                            'Token': token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            phone: candidateInfo['phone'],
                            template: 96387,
                            param_list: [`${model}（请无视以下内容：`, '', '', '']
                        })
                    });
                    const result = await response.json();
                    if (result.code !== 200) {
                        return candidateInfo['name'];
                    }
                });
                Promise.all(results).then(failed => {
                    const failedNames = failed.filter(i => i);
                    failedNames.length === 0
                        ? res.send({ type: 'success' })
                        : res.send({ type: 'info', message: `未能成功发送短信的有：${failedNames}` })
                });
                redisClient.del(`userCode:${decoded['uid']}`);
            } else {
                res.send({ message: '验证码不正确', type: 'warning' })
            }
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })()
};
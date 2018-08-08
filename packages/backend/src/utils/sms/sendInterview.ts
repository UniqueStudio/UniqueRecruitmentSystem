import { Request, Response } from 'express';
import { verifyJWT } from '../../lib/checkData';
import { database, getAsync, redisClient } from '../../app';
import { smsSendURL, token } from '../../lib/consts';
import { ObjectId } from 'mongodb';
import fetch from 'node-fetch';

export const sendInterview = (req: Request, res: Response) => {
    const body = req.body;
    const { step, candidates } = body;
    (async () => {
        try {
            const decoded = verifyJWT(req.get('Authorization'));
            const code = await getAsync(`userCode:${decoded['uid']}`);
            if (body.code === code) {
                const results = candidates.map(async (i: string) => {
                    const candidateInfo = (await database.query('candidates', { _id: new ObjectId(i) }))[0];
                    const slot = candidateInfo[`slot${step}`];
                    const time = `${slot[0]}(${slot[1]})${slot[2]}`;
                    let model = `${candidateInfo['name']}你好，你的${step === 2 ? '群面' : `${candidateInfo['group']}组组面`}时间为${time}，请准时到场`;
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
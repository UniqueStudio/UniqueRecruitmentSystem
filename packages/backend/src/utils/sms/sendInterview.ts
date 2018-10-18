import { Request, Response } from 'express';
import { verifyJWT } from '../../lib/checkData';
import { database, getAsync, redisClient } from '../../app';
import { smsSendURL, token } from '../../lib/consts';
import { ObjectId } from 'mongodb';
import fetch from 'node-fetch';

export const sendInterview = (req: Request, res: Response) => {
    const body = req.body;
    const { interviewStage, candidates, code: userCode, place } = body;
    (async () => {
        try {
            const decoded = verifyJWT(req.get('Authorization'));
            if ([interviewStage, candidates, userCode, place].includes(undefined)) {
                res.send({ message: '请完整填写信息', type: 'warning' });
                return;
            }
            const code = await getAsync(`userCode:${decoded['uid']}`);
            if (userCode === code) {
                let errorMessage = '';
                const results = candidates.map(async (i: string) => {
                    const candidateInfo = (await database.query('candidates', { _id: new ObjectId(i) }))[0];
                    const translator = { 'morning': '上午', 'afternoon': '下午', 'evening': '晚上' };
                    const slot = candidateInfo[`slot${interviewStage}`];
                    const time = `${slot[0]}(${translator[slot[1]]})${slot[2]}`;
                    const response = await fetch(smsSendURL, {
                        method: 'POST',
                        headers: {
                            'Token': token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            phone: candidateInfo['phone'],
                            template: 96404,
                            param_list: [candidateInfo['name'], time, place, interviewStage === 2 ? '团队群面' : `${candidateInfo['group']}组组面`]
                        })
                    });
                    const result = await response.json();
                    if (result.code !== 200) {
                        errorMessage = result.message.replace('\n', '');
                        return candidateInfo['name'];
                    }
                });
                Promise.all(results).then(failed => {
                    const failedNames = failed.filter(i => i);
                    failedNames.length === 0
                        ? res.send({ type: 'success' })
                        : res.send({ type: 'info', message: `因${errorMessage}而未能成功发送短信的有：${failedNames}` })
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
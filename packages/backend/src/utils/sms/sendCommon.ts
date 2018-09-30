import { verifyJWT } from '../../lib/checkData';
import { formURL, GROUPS as groups, smsSendURL, token, STEP } from '../../lib/consts';
import { ObjectId } from 'mongodb';
import fetch from 'node-fetch';
import { database, redisClient, getAsync } from '../../app';
import { Request, Response } from 'express';
import titleConverter from '../../lib/titleConverter';

const generateSMS = (name: string, title: string, step: string, type: string, group: string, rest?: string, userRest?: string) => {
    const suffix = '请勿回复本短信';
    return type === 'accept' ?
        {
            template: 185990,
            param_list: [
                name,
                title,
                group,
                step,
                userRest ? userRest : step === STEP[1] || step === STEP[3] ? `，请进入以下链接选择面试时间：${rest}。${suffix}`
                    : step === STEP[0] ? `，${rest}${STEP[1]}，请务必准时到场。${suffix}`
                    : step === STEP[2] ? `，${rest}${STEP[3]}，请务必准时到场。${suffix}`
                    : step === STEP[4] ? `，你已成功加入${group}组。${suffix}`
                    : ''
            ]
        }
        : {
            template: 185987,
            param_list: [name, title, group, step, `不要灰心，继续学习。期待与更强大的你的相遇！${suffix}`]
        }
};

export const sendCommon = (req: Request, res: Response) => {
    const body = req.body;
    const { step, type, group, title, candidates, code: userCode, time, place, rest: userRest } = body;
    (async () => {
        try {
            const decoded = verifyJWT(req.get('Authorization'));
            if ([step, type, group, title, candidates, userCode].includes(undefined)
                || [step, type, group, title, candidates, userCode].includes('')
            ) {
                res.send({ message: '请完整填写信息', type: 'warning' });
                return;
            }
            const recruitment = (await database.query('recruitments', { title }))[0];
            let formId = '';
            if (type === 'accept') {
                if (step === '笔试流程') {
                    if (!(recruitment['time1'] && recruitment['time1'][group])) {
                        res.send({ message: '请设置组面时间！', type: 'warning' });
                        return;
                    }
                    formId = `${recruitment['_id']}${groups.indexOf(group)}1`;
                } else if (step === '熬测流程') {
                    if (!recruitment['time2']) {
                        res.send({ message: '请设置群面时间！', type: 'warning' });
                        return;
                    }
                    formId = `${recruitment['_id']}2`;
                }
            }
            let rest = '';
            if (time && place) {
                rest = `请于${time}在${place}参加`;
            }
            const code = await getAsync(`userCode:${decoded['uid']}`);
            if (userCode === code) {
                const results = candidates.map(async (i: string) => {
                    const candidateInfo = (await database.query('candidates', { _id: new ObjectId(i) }))[0];
                    if (type === 'reject') {
                        await database.update('candidates', { _id: new ObjectId(i) }, { rejected: true })
                    }
                    const smsBody = generateSMS(candidateInfo['name'], titleConverter(title), step, type, group, formId ? `${formURL}/${formId}/${i}` : rest ? rest : '', userRest);
                    const response = await fetch(smsSendURL, {
                        method: 'POST',
                        headers: {
                            'Token': token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            phone: candidateInfo['phone'],
                            ...smsBody
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
            } else {
                res.send({ message: '验证码不正确', type: 'warning' })
            }
            redisClient.del(`userCode:${decoded['uid']}`);
        } catch (err) {
            res.send({ message: err.message, type: 'danger' })
        }
    })()
};
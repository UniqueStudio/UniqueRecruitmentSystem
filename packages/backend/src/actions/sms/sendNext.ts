import { RequestHandler } from 'express';
import { body } from 'express-validator/check';
import fetch from 'node-fetch';
import { formURL, GROUPS_ as groups, smsAPI, STEPS, token } from '../../config/consts';
import { CandidateRepo, RecruitmentRepo } from '../../database/model';
import { titleConverter } from '../../utils/titleConverter';

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
                userRest ? userRest : step === STEPS[1] || step === STEPS[3] ? `，请进入以下链接选择面试时间：${rest}。${suffix}`
                    : step === STEPS[0] ? `，${rest}${STEPS[1]}，请务必准时到场。${suffix}`
                        : step === STEPS[2] ? `，${rest}${STEPS[3]}，请务必准时到场。${suffix}`
                            : step === STEPS[4] ? `，你已成功加入${group}组。${suffix}`
                                : ''
            ]
        }
        : {
            template: 185987,
            param_list: [name, title, group, step, `不要灰心，继续学习。期待与更强大的你的相遇！${suffix}`]
        };
};

export const sendNext: RequestHandler = async (req, res, next) => {
    const { step, type, group, title, time, place, rest: userRest } = req.body;
    const candidates: string[] = req.body.candidates;
    try {
        if ([step, type, group, title, candidates].includes(undefined)
            || [step, type, group, title, candidates].includes('')
        ) {
            res.send({ message: '请完整填写信息', type: 'warning' });
            return;
        }
        const recruitment = (await RecruitmentRepo.query({ title }))[0];
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
        let errorMessage = '';
        const results = candidates.map(async (id: string) => {
            const candidateInfo = await CandidateRepo.queryById(id);
            if (!candidateInfo) {
                throw new Error('Candidate doesn\'t exist!');
            }
            if (type === 'reject') {
                await CandidateRepo.updateById(id, { rejected: true });
            }
            const restMessage = formId ? `${formURL}/${formId}/${id}` : rest ? rest : '';
            const smsBody = generateSMS(candidateInfo.name, titleConverter(title), step, type, group, restMessage, userRest);
            const response = await fetch(smsAPI, {
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
                errorMessage = result.message.replace('\n', '');
                throw new Error(candidateInfo['name']);
            }
            return;
        });
        results.map(i => i.catch(err => err));
        Promise.all(results).then((failed) => {
            const failedNames = failed.filter((i) => i);
            failedNames.length === 0
                ? res.send({ type: 'success' })
                : res.send({ type: 'info', message: `因${errorMessage}而未能成功发送短信的有：${failedNames}` });
        });
    } catch (error) {
        return next(error);
    }
};

export const sendNextVerify = [
    body('step').isInt({ lt: 6, gt: -1 }).withMessage('Step is invalid!'),
    body('type').isIn(['accept', 'reject']).withMessage('Type is invalid!'),
];

import { Request, RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import moment from 'moment';
import fetch from 'node-fetch';
import { formURL, smsAPI, token } from '../../config/consts';
import { CandidateRepo, PayloadRepo, RecruitmentRepo } from '../../database/model';
import { redisAsync } from '../../redis';
import { errorRes } from '../../utils/errorRes';
import { generateSMS } from '../../utils/generateSMS';
import md5 from '../../utils/md5';
import { titleConverter } from '../../utils/titleConverter';

const padZero = (toPad: number) => toPad.toString().padStart(2, '0');

const dateTranslator = (timestamp: number) => {
    const date = moment(timestamp).utcOffset(8);
    return `${date.month() + 1}月${date.date()}日${padZero(date.hour())}:${padZero(date.minute())}`;
};

const send = (req: Request) => {
    const { step, type, time, place, rest, next: nextStep, candidates } = req.body;
    let recruitmentId = '';
    return candidates.map(async (id: string) => {
        const candidateInfo = await CandidateRepo.queryById(id);
        if (!candidateInfo) {
            return new Error("Candidate doesn't exist!");
        }
        const { name, title, group, interviews, phone } = candidateInfo;
        try {
            if (type === 'accept' && !recruitmentId) {
                // 仅执行一次，用于生成含有recruitment id的formId
                // 以后所有的candidates都可以复用这个formId
                const recruitment = (await RecruitmentRepo.query({ title }))[0];
                if (recruitment.end < Date.now()) {
                    return new Error('This recruitment has already ended!');
                }
                if (nextStep === 2) {
                    // 发送组面短信
                    const data = recruitment.groups.find((groupData) => groupData.name === group);
                    if (!data) {
                        return new Error("Group doesn't exist!");
                    }
                    if (!data.interview.length) {
                        return new Error('Please set group interview time first!');
                    }
                    recruitmentId = `${recruitment._id}`;
                    // formId = `${recruitment._id}${GROUPS_.indexOf(group)}1`;
                } else if (nextStep === 4) {
                    // 发送群面短信
                    if (!recruitment.interview.length) {
                        return new Error('Please set team interview time first!');
                    }
                    recruitmentId = `${recruitment._id}`;
                    // formId = `${recruitment._id}2`;
                }
            }
            if (type === 'reject') {
                await CandidateRepo.updateById(id, { rejected: true });
            }
            const payload = {
                recruitmentId,
                id,
                step: nextStep === 2 ? 'group' : 'team',
                group
            };
            const hash = md5(payload);
            Promise.all([
                PayloadRepo.createAndInsert({ ...payload, hash }),
                redisAsync.set(`payload:${hash}`, id, 'EX', 60 * 60 * 24 * 2)
            ]).catch((e) => {
                return new Error(`Error in ${name}: ${e}`);
            });
            const url = recruitmentId ? `${formURL}/${hash}` : '';
            let allocated;
            if (type === 'group' || type === 'team') {
                allocated = interviews[type].allocation;
            }
            const smsBody = generateSMS({
                name,
                title: titleConverter(title),
                step,
                type,
                group,
                rest,
                nextStep,
                url,
                time: type === 'accept' ? time : allocated && dateTranslator(allocated),
                place
            });
            const response = await fetch(smsAPI, {
                method: 'POST',
                headers: {
                    Token: token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone,
                    ...smsBody
                })
            });
            const { code, message }: { code: number, message: string } = await response.json();
            if (code !== 200) {
                return new Error(`Error in ${name}: ${message.replace('\n', '')}`);
            }
            return;
        } catch ({ message }) {
            return new Error(`Error in ${name}: ${message}`);
        }
    });
};

export const sendSMS: RequestHandler = async (req, res, next) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return next(errorRes(validationErrors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        Promise
            .all(send(req))
            .then((values) => {
                const errors = values.filter((value) => value instanceof Error).map(({ message }) => message);
                if (errors.length) {
                    res.json({ type: 'warning', messages: errors });
                } else {
                    res.json({ type: 'success' });
                }
            })
            .catch((error) => next(error));
    } catch (error) {
        return next(error);
    }
};

export const sendSMSVerify = [
    body('type').isIn(['accept', 'reject', 'group', 'team']).withMessage('Type is invalid!'),
];

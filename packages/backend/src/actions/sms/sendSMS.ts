import { RequestHandler } from 'express';
import { body, validationResult } from 'express-validator/check';
import moment from 'moment';
import fetch from 'node-fetch';
import { formURL, GROUPS_, smsAPI, STEPS, token } from '../../config/consts';
import { CandidateRepo, RecruitmentRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';
import { titleConverter } from '../../utils/titleConverter';

interface Model {
    type: string;
    name: string;
    group: string;
    title: string;
    step: number;
    time: string;
    place: string;
    rest: string;
    url: string;
}

const dateTranslator = (timestamp: number) => {
    const date = moment(timestamp).utcOffset(8);
    return `${date.month() + 1}月${date.date()}日${date.hour()}:${date.minute()}`;
};

const generateSMS = ({ name, title, step, type, group, time, place, rest, url }: Model) => {
    const suffix = ' (请勿回复本短信)';
    if (!name) throw new Error('Name not provided!');
    switch (type) {
        case 'accept': {
            if (!group) throw new Error('Group not provided!');
            if (!title) throw new Error('Title not provided!');
            let defaultRest = '';
            switch (step) {
                case 1:
                case 3:
                    if (!url) throw new Error('URL not provided!');
                    defaultRest = `，请进入以下链接选择面试时间：${url}`;
                    break;
                case 0:
                case 2:
                    if (!time || !place) throw new Error('Time or place not provided!');
                    defaultRest = `，请于${time}在${place}参加${STEPS[step + 1]}，请务必准时到场`;
                    break;
                case 4:
                    defaultRest = `，你已成功加入${group}组`;
                    break;
                default:
                    throw new Error('Step is invalid!');
            }
            rest = `${rest || defaultRest}${suffix}`;
            return { template: 185990, param_list: [name, title, group, STEPS[step], rest] };
        }
        case 'reject': {
            if (!group) throw new Error('Group not provided!');
            if (!title) throw new Error('Title not provided!');
            if (!step || step < 0 || step > 4) throw new Error('Step is invalid!');
            const defaultRest = '不要灰心，继续学习。期待与更强大的你的相遇！';
            rest = `${rest || defaultRest}${suffix}`;
            return { template: 185987, param_list: [name, title, group, STEPS[step], rest] };
        }
        case 'group': {
            if (!group) throw new Error('Group not provided!');
            if (!place) throw new Error('Place not provided!');
            if (!time) throw new Error('Time not provided!');
            return { template: 96404, param_list: [name, time, place, `${group}组组面`] };
        }
        case 'team': {
            if (!place) throw new Error('Place not provided!');
            if (!time) throw new Error('Time not provided!');
            return { template: 96404, param_list: [name, time, place, `团队群面`] };
        }
        default:
            throw new Error('Type not provided!');
    }
};

export const sendSMS: RequestHandler = async (req, res, next) => {
    try {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return next(errorRes(validationErrors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const { step, type, time, place, rest, candidates } = req.body;
        let formId = '';
        const promises = candidates.map(async (id: string) => {
            const candidateInfo = await CandidateRepo.queryById(id);
            if (!candidateInfo) {
                return new Error('Candidate doesn\'t exist!');
            }
            const { name, title, group, interviews, phone } = candidateInfo;
            try {
                if (type === 'accept' && !formId) {
                    const recruitment = (await RecruitmentRepo.query({ title }))[0];
                    if (step === 1) {
                        const data = recruitment.groups.find((groupData) => groupData.name === group);
                        if (!data) {
                            return new Error('Group doesn\'t exist!');
                        }
                        if (!data.interview.length) {
                            return new Error('Please set group interview time first!');
                        }
                        formId = `${recruitment._id}${GROUPS_.indexOf(group)}1`;
                    } else if (step === 3) {
                        if (!recruitment.interview.length) {
                            return new Error('Please set team interview time first!');
                        }
                        formId = `${recruitment._id}2`;
                    }
                }
                if (type === 'reject') {
                    await CandidateRepo.updateById(id, { rejected: true });
                }
                const url = formId ? `${formURL}/${formId}/${id}` : '';
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
                    url,
                    time: type === 'accept' ? time : allocated && dateTranslator(allocated),
                    place
                });
                const response = await fetch(smsAPI, {
                    method: 'POST',
                    headers: {
                        'Token': token,
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
        Promise.all(promises)
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

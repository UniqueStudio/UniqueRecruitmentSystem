import { RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import path from 'path';
import { io } from '../../app';

import { GENDERS, GRADES, GROUPS_, RANKS } from '../../config/consts';
import { CandidateRepo, RecruitmentRepo } from '../../database/model';
import { copyFile } from '../../utils/copyFile';
import { errorRes } from '../../utils/errorRes';
import { logger } from '../../utils/logger';
import sendEmail from '../../utils/sendEmail';
import { sendSMS } from './sendSMS';

export const addCandidate: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const { name, grade, institute, major, rank, mail, phone, group, gender, intro, title, isQuick, referrer } = req.body;
        let filepath = '';
        if (req.file) {
            const { originalname: filename, path: oldPath } = req.file;
            filepath = path.join('../resumes', title, group);
            filepath = await copyFile(oldPath, filepath, `${name} - ${filename}`);
        }
        const info = await CandidateRepo.createAndInsert({
            name,
            gender,
            grade,
            institute,
            major,
            rank,
            mail,
            phone,
            group,
            intro,
            isQuick,
            title,
            resume: filepath,
            referrer
        });
        await RecruitmentRepo.update({ title, 'groups.name': group }, {
            'groups.$.total': await CandidateRepo.count({ title, group }),
            'groups.$.steps.0': await CandidateRepo.count({ title, group, step: 0 }),
            'total': await CandidateRepo.count({ title })
        });
        res.json({ type: 'success' });
        io.emit('addCandidate', { candidate: info });
        io.emit('updateRecruitment');
        setTimeout(() => {
            // {1}你好，您当前状态是{2}，请关注手机短信及邮箱以便获取后续通知。
            sendSMS(phone, { template: 416721, param_list: [name, '成功提交报名表单'] })
                .catch((e) => logger.error(e));
            const question = global.acmConfig[group];
            if (!question.uri) return;
            sendEmail({ name, address: mail }, question.uri, question.description)
                .catch((e) => logger.error(e));
        }, 30 * 1000);
    } catch (err) {
        return next(err);
    }
};

export const verifyTitle = body('title').matches(/\d{4}[ASC]/, 'g').withMessage('Title is invalid!')
    .custom(async (title) => {
        const recruitment = (await RecruitmentRepo.query({ title }))[0];
        if (!recruitment) {
            throw new Error('Current recruitment doesn\'t exist!');
        }
        if (Date.now() < recruitment.begin) {
            throw new Error('Current recruitment is not started!');
        }
        if (Date.now() > recruitment.stop) {
            throw new Error('Current recruitment has ended!');
        }
    });

export const addCandidateVerify = [
    body('name').isString().withMessage('Name is invalid!'),
    body('mail').isEmail().withMessage('Mail is invalid!'),
    body('grade').isInt({ lt: GRADES.length, gt: -1 }).withMessage('Grade is invalid!'),
    body('institute').isString().withMessage('Institute is invalid!'),
    body('major').isString().withMessage('Major is invalid!'),
    body('gender').isInt({ lt: GENDERS.length, gt: -1 }).withMessage('Gender is invalid!'),
    body('isQuick').isBoolean().withMessage('IsQuick is invalid!'),
    body('phone').isMobilePhone('zh-CN').withMessage('Phone is invalid!'),
    body('phone').custom(async (phone, { req }) => {
        if ((await CandidateRepo.query({ phone, title: req.body.title })).length !== 0) {
            throw new Error('You have already applied!');
        }
    }),
    body('group')
        .isIn(GROUPS_)
        .withMessage('Group is invalid!')
        .custom((group, { req }) => !(group === 'design' && !req.file))
        .withMessage('Signing up Design team needs works'),
    body('rank').isInt({ lt: RANKS.length, gt: -1 }).withMessage('Rank is invalid!'),
    body('intro').isString().withMessage('Intro is invalid!'),
    body('referrer').isString().withMessage('Referrer is invalid!'),
    verifyTitle
];

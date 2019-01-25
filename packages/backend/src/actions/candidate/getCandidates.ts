import { RequestHandler } from 'express';
import { param, validationResult } from 'express-validator/check';
import { CandidateRepo, RecruitmentRepo, UserRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';

export const getCandidates: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next(errorRes('User doesn\'t exist!', 'warning'));
        }
        const { joinTime } = user;
        const query = JSON.parse(req.params.query);
        const { title } = query;
        if (title === joinTime) {
            return next(errorRes('You don\'t have permission to view this recruitment!', 'warning'));
        }
        const recruitment = await RecruitmentRepo.query({ title });
        if (recruitment.length === 0) {
            return next({ type: 'warning', message: 'Recruitment doesn\'t exist!' });
        }
        const data = await CandidateRepo.query(query);
        res.json({ data, type: 'success' });
    } catch (error) {
        return next(error);
    }
};

export const getCandidateVerify = [
    param('query').isJSON().withMessage('Query is invalid!')
        .custom((query) => {
            const { title } = JSON.parse(query);
            return title.match(/\d{4}[ASC]/g);
        }).withMessage('Title is invalid!')
];

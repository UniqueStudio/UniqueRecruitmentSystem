import { RequestHandler } from 'express';
import { STEPS } from '../../config/consts';
import { CandidateRepo, RecruitmentRepo, UserRepo } from '../../database/model';

export const getCandidates: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next({ message: 'User doesn\'t exist!', type: 'warning' });
        }
        const { joinTime } = user;
        let title = req.params.title;
        const formatted = STEPS.map(() => ({}));
        if (!title) {
            const pending = await RecruitmentRepo.query({ end: { $gt: Date.now() } });
            if (pending.length === 0) {
                return next({ data: formatted, type: 'info', message: 'No pending recruitments' });
            }
            title = pending[0].title;
        }
        if (title === joinTime) {
            return next({ message: 'You don\'t have permission to view this recruitment!', type: 'warning' });
        }
        const data = await CandidateRepo.query({ title });
        data.forEach((candidate) => {
            const { step, _id, resume } = candidate;
            formatted[step][_id] = { ...candidate, resume: Boolean(resume) };
        });
        res.send({ data: formatted, title, type: 'success' });
    } catch (error) {
        return next(error);
    }
};

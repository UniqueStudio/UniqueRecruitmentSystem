import { RequestHandler } from 'express';

import { RecruitmentRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';

export const getPendingTitles: RequestHandler = async (req, res, next) => {
    try {
        const pending = await RecruitmentRepo.query({ end: { $gt: Date.now() }, begin: { $lt: Date.now() } });
        if (pending.length === 0) {
            return next(errorRes('No pending recruitment!', 'info'));
        }
        res.json({ data: pending.map((item) => item.title), type: 'success' });
    } catch (error) {
        return next(error);
    }
};

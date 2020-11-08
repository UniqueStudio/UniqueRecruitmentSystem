import { Handler } from '@config/types';
import { RecruitmentRepo } from '@database/model';
import { errorRes } from '@utils/errorRes';

export const getPendingTitles: Handler = async (req, res, next) => {
    try {
        const pending = await RecruitmentRepo.query({ stop: { $gt: Date.now() }, begin: { $lt: Date.now() } });
        if (pending.length === 0) {
            return next(errorRes('No pending recruitment!', 'info'));
        } else if (pending.length === 1) { // return an array of one element for backward compatibility
            res.json({ data: [pending[0].title], type: 'success' });
        } else {
            res.json({ data: [pending.map((item) => item.title).find((title) => !title.includes('O'))], type: 'success' });
        }
    } catch (error) {
        return next(error);
    }
};

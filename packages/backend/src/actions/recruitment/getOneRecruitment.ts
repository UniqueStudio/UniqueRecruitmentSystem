import { RequestHandler } from 'express';

import { RecruitmentRepo, UserRepo } from '../../database/model';

export const getOneRecruitment: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            res.send({ message: 'User doesn\'t exist!', type: 'warning' });
            return;
        }
        const { joinTime } = user;
        const title = req.params.title;
        if (joinTime === title) {
            return next({ message: 'You don\'t have permission to view this recruitment!', type: 'warning' });
        }
        const data = await RecruitmentRepo.query({ title });
        if (!data.length) {
            return next({ message: 'Recruitment doesn\'t exist!', type: 'warning' });
        }
        res.send({ data: data[0], type: 'success' });
    } catch (error) {
        return next(error);
    }
};

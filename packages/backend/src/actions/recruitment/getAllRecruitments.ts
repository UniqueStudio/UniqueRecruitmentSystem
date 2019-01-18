import { RequestHandler } from 'express';

import { RecruitmentRepo, UserRepo } from '../../database/model';

export const getAllRecruitments: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next({ message: 'User doesn\'t exist!', type: 'warning' });
        }
        const { joinTime } = user;
        const data = await RecruitmentRepo.query({ title: { $ne: joinTime } });
        if (!data.length) {
            return next({ message: 'Recruitment doesn\'t exist!', type: 'warning' });
        }
        res.send({ data, type: 'success' });
    } catch (error) {
        return next(error);
    }
};

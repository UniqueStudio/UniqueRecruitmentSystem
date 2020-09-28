import { RequestHandler } from 'express';

import { RecruitmentRepo/*, UserRepo*/ } from '@database/model';
import { errorRes } from '@utils/errorRes';

export const getAllRecruitments: RequestHandler = async (req, res, next) => {
    try {
        // const user = await UserRepo.queryById(res.locals.id);
        // if (!user) {
        //     return next(errorRes('User doesn\'t exist!', 'warning'));
        // }
        // const { joinTime } = user;
        const data = await RecruitmentRepo.query({ /*title: { $ne: joinTime }*/ });
        if (!data.length) {
            return next(errorRes('Recruitment doesn\'t exist!', 'warning'));
        }
        res.json({ data, type: 'success' });
    } catch (error) {
        return next(error);
    }
};

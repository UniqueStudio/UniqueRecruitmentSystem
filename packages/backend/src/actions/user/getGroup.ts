import { RequestHandler } from 'express';
import { UserRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';

export const getGroup: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next(errorRes('User doesn\'t exist!', 'warning'));
        }
        const { group } = user;
        const groupUsers = await UserRepo.query({ group });
        res.json({ data: groupUsers, type: 'success' });
    } catch (error) {
        return next(error);
    }
};

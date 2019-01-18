import { RequestHandler } from 'express';
import { UserRepo } from '../../database/model';

export const getGroup: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next({ message: 'User doesn\'t exist!', type: 'warning' });
        }
        const { group } = user;
        const groupUsers = await UserRepo.query({ group });
        res.send({ data: groupUsers, type: 'success' });
    } catch (error) {
        return next(error);
    }
};

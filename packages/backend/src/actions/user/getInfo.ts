import { RequestHandler } from 'express';
import { UserRepo } from '../../database/model';

export const getInfo: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next({ message: 'User doesn\'t exist!', type: 'warning' });
        }
        res.send({ data: user[0], type: 'success' });
    } catch (error) {
        return next(error);
    }
};

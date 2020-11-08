import { Handler } from '@config/types';
import { UserRepo } from '@database/model';
import { errorRes } from '@utils/errorRes';

export const getInfo: Handler = async (req, res, next) => {
    try {
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next(errorRes('User doesn\'t exist!', 'warning'));
        }
        user.password = undefined;
        res.json({ data: user, type: 'success' });
    } catch (error) {
        return next(error);
    }
};

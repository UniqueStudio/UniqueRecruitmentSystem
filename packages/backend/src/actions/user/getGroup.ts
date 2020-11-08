import { Handler } from '@config/types';
import { UserRepo } from '@database/model';
import { errorRes } from '@utils/errorRes';

export const getGroup: Handler = async (req, res, next) => {
    try {
        const user = await UserRepo.queryById(res.locals.id);
        if (!user) {
            return next(errorRes('User doesn\'t exist!', 'warning'));
        }
        const { group } = user;
        const groupUsers = await UserRepo.query({ group });
        groupUsers.forEach((member) => member.password = undefined);
        res.json({ data: groupUsers, type: 'success' });
    } catch (error) {
        return next(error);
    }
};

import { Handler } from '@config/types';
import { RecruitmentRepo } from '@database/model';
import { errorRes } from '@utils/errorRes';

export const getOneRecruitment: Handler = async (req, res, next) => {
    try {
        // const user = await UserRepo.queryById(res.locals.id);
        // if (!user) {
        //     res.send(errorRes('User doesn\'t exist!', 'warning'));
        //     return;
        // }
        // const { joinTime } = user;
        const { title } = req.params;
        // if (joinTime === title) {
        //     return next(errorRes('You don\'t have permission to view this recruitment!', 'warning'));
        // }
        const data = await RecruitmentRepo.query({ title });
        if (!data.length) {
            return next(errorRes('Recruitment doesn\'t exist!', 'warning'));
        }
        res.json({ data: data[0], type: 'success' });
    } catch (error) {
        return next(error);
    }
};

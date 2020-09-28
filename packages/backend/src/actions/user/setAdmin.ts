import { RequestHandler } from 'express';
import { UserRepo } from '@database/model';
import { errorRes } from '@utils/errorRes';
import { body, validationResult } from 'express-validator';
import { GROUPS_ } from '@config/consts';

// set users to admin, only admin or captain can do this
// notice that non-exist user will be ignore
// and can only add admin within same group
export const setAdmin: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }

        const { id: uid } = res.locals;
        const user = await UserRepo.queryById(uid);
        if (!user) {
            return next(errorRes("User doesn't exist!", 'warning'));
        }
        if (!user.isAdmin && !user.isCaptain) {
            return next(errorRes('User has no permission', 'warning'));
        }

        const { group, who } = req.body;

        // can only set admin within same group
        // `who` from frontend is the phone list of new admins
        const admins = await UserRepo.query({ group, phone: { $in: who }, isAdmin: false });

        // frontend disables cancel admin, so no new admin returns a error
        if (!admins.length) {
            return next(errorRes('No new admin found', 'error'));
        }

        await UserRepo.updateByIds(
            admins.map((u) => u._id),
            { isAdmin: true }
        );

        res.json({ type: 'success', newAdmins: admins.map(({ phone }) => ({ phone })) });
    } catch (error) {
        return next(error);
    }
};

export const setAdminVerify = [
    body('who').isArray().isLength({ min: 1 }).withMessage('Who is invalid!'),
    body('group').isIn(GROUPS_).withMessage('Group is invalid'),
];

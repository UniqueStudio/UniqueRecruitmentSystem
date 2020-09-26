import { RequestHandler } from "express";
import { UserRepo } from "../../database/model";
import { errorRes } from "../../utils/errorRes";
import { body, validationResult } from 'express-validator';
import { GROUPS_ } from "../../config/consts";
import { User } from "../../config/types";

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
            return next(errorRes('User doesn\'t exist!', 'warning'));
        }
        if (!user.isAdmin || !user.isCaptain) {
            return next(errorRes('User has no permission', 'warning'));
        }

        const { group, who } = req.body;

        const admins = (await Promise.all(who.map(async (name: string) => {
            return UserRepo.query({ username: name, group, isAdmin: false });
        }))).flat() as User[];

        // frontend disables cancel admin, so no new admin returns a error
        if (!admins.length) {
            return next(errorRes('No new admin found', 'error'));
        }

        const promises = admins.map(async (u) => {
            return UserRepo.updateById(u._id, { isAdmin: true });
        });

        Promise.all(promises).then(() => res.json({ type: 'success' }));
    } catch (error) {
        return next(error);
    }
};

export const setAdminVerify = [
    body('who').isArray().withMessage('Who is invalid!'),
    body('group').isIn(GROUPS_).withMessage('Group is invalid'),
];

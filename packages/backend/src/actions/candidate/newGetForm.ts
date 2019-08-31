import { RequestHandler } from 'express';
import { param, validationResult } from 'express-validator/check';
import { RecruitmentRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';
import { generateJWT } from '../../utils/generateJWT';
import { extractJWT } from "../../utils/verifyJWT";

export const newGetForm: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const { id, recruitmentId, step, group: groupName } = extractJWT(req.params.token)

        const token = generateJWT({ id }, 86400);
        switch (step) {
            case 'group': {
                // 组面
                const recruitment = await RecruitmentRepo.queryById(recruitmentId);
                if (!recruitment) {
                    return next(errorRes('Recruitment doesn\'t exist！', 'warning'));
                }
                const groupData = recruitment.groups.find((group) => group.name === groupName);
                return res.json({ type: 'success', time: groupData!.interview, token });
            }
            case 'team': {
                // 群面
                const recruitment = await RecruitmentRepo.queryById(recruitmentId);
                if (!recruitment) {
                    return next(errorRes('Recruitment doesn\'t exist！', 'warning'));
                }
                return res.json({ type: 'success', time: recruitment.interview, token });
            }
            default: {
                return next(errorRes('Form doesn\'t exist！', 'warning'));
            }
        }
    } catch (error) {
        return next(error);
    }
};

export const newGetFormVerify = [
    param('token').isString().withMessage('URL is invalid!'),
];

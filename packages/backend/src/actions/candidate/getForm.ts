import { RequestHandler } from 'express';
import { param, validationResult } from 'express-validator';
import { GROUPS_ } from '../../config/consts';
import { RecruitmentRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';
import { generateJWT } from '../../utils/generateJWT';

export const getForm: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const formId = req.params.formId;
        const type = formId.slice(-1);
        const cid = req.params.cid;
        const token = generateJWT({ id: cid }, 86400);
        switch (type) {
            case '1': {
                const groupId = +formId.slice(-2, -1);
                const recruitmentId = formId.slice(0, -2);
                const recruitment = await RecruitmentRepo.queryById(recruitmentId);
                if (!recruitment) {
                    return next(errorRes('Recruitment doesn\'t exist！', 'warning'));
                }
                const groupData = recruitment.groups.find((group) => group.name === GROUPS_[groupId]);
                return res.json({ type: 'success', time: groupData!.interview, token });
            }
            case '2': {
                const recruitmentId = formId.slice(0, -1);
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

export const getFormVerify = [
    param('formId').isString().withMessage('URL is invalid!'),
    param('cid').isString().withMessage('URL is invalid!'),
];

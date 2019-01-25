import { RequestHandler } from 'express';
import { body, param, validationResult } from 'express-validator/check';
import { CandidateRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';

export const allocateOne: RequestHandler = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(errorRes(errors.array({ onlyFirstError: true })[0]['msg'], 'warning'));
        }
        const { cid, type } = req.params;
        const { time } = req.body;
        const candidate = await CandidateRepo.queryById(cid);
        if (!candidate) {
            return next(errorRes('Candidate doesn\'t exist!', 'warning'));
        }
        await CandidateRepo.updateById(cid, { [`interviews.${type}.allocation`]: time });
        return res.json({ type: 'success' });
    } catch (error) {
        return next(error);
    }
};

export const allocateOneVerify = [
    param('type').custom((type) => ['group', 'team'].includes(type)).withMessage('Interview type is invalid!'),
    body('time').isInt().withMessage('Interview time is invalid!'),
    param('cid').isString().withMessage('Candidate id is invalid!'),
];

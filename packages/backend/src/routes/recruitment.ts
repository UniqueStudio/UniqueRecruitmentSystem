import express from 'express';
import {
    getAllRecruitments, getOneRecruitment,
    launchRecruitment, launchRecruitmentVerify,
    setRecruitment, setRecruitmentVerify
} from '../actions/recruitment';

import { authenticator } from '../middlewares/authenticator';
import { codeChecker } from '../middlewares/codeChecker';
// import { setSlots } from '../actions/recruitment/setSlots';

const router = express.Router();
router.use(authenticator);

// launch a new recruitment
router.post('/', launchRecruitmentVerify, codeChecker('user'), launchRecruitment);

// get all history recruitments
router.get('/', getAllRecruitments);

// get a certain recruitment
router.get('/:title', getOneRecruitment);

// set recruitment
router.put('/:title', setRecruitmentVerify, setRecruitment);

// // set slots for periods
// router.post('/:title/slots', setSlots);

export const recruitment = router;

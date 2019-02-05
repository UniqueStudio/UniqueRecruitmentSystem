import express from 'express';
import {
    getAllRecruitments, getOneRecruitment, getPendingTitles,
    launchRecruitment, launchRecruitmentVerify,
    setRecruitment, setRecruitmentVerify
} from '../actions/recruitment';

import { authenticator } from '../middlewares/authenticator';
import { codeChecker } from '../middlewares/codeChecker';

const router = express.Router();

// get title of pending recruitments
router.get('/pending', getPendingTitles);

router.use(authenticator);

// launch a new recruitment
router.post('/', launchRecruitmentVerify, codeChecker('user'), launchRecruitment);

// get all history recruitments
router.get('/', getAllRecruitments);

// get a certain recruitment
router.get('/title/:title', getOneRecruitment);

// set recruitment
router.put('/title/:title', setRecruitmentVerify, setRecruitment);

export const recruitment = router;

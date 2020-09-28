import { Router } from 'express';
import {
    getAllRecruitments, getOneRecruitment, getPendingTitles,
    launchRecruitment, launchRecruitmentVerify,
    setRecruitment, setRecruitmentVerify
} from '../actions/recruitment';

import { authenticator } from '@mw/authenticator';
import { codeChecker } from '@mw/codeChecker';

const router = Router();

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

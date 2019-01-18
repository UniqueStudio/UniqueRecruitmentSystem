import express from 'express';
import { authenticator } from '../middlewares/authenticator';
import { codeChecker } from '../middlewares/codeChecker';
import { fileHandler } from '../middlewares/fileHandler';

import { addCandidate, addCandidateVerify, getCandidates, getResume } from '../actions/candidate';

const router = express.Router();

// add new candidate
router.post('/', fileHandler.single('resume'), addCandidateVerify, codeChecker('candidate'), addCandidate);

router.use(authenticator);

// // set candidates data
// router.put('/:cid', setCandidate);
//
// get all candidates in the latest recruitment
router.get('/', getCandidates);
router.get('/recruitment/:title', getCandidates);

// get resume of a candidate
router.get('/resume/:cid', getResume);

export const candidate = router;

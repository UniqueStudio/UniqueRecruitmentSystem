import { Router } from 'express';
import { authenticator } from '../middlewares/authenticator';
import { codeChecker } from '../middlewares/codeChecker';
import { fileHandler } from '../middlewares/fileHandler';

import {
    addCandidate,
    addCandidateVerify,
    allocateAll,
    allocateAllVerify,
    allocateOne,
    allocateOneVerify,
    getCandidates,
    getCandidateVerify,
    getForm,
    getFormVerify,
    getResume,
    setCandidate,
    setCandidateVerify,
    newGetForm,
    newGetFormVerify,
    newSetCandidate,
    newSetCandidateVerify
} from '../actions/candidate';

const router = Router();

// add new candidate
router.post('/', fileHandler.single('resume'), addCandidateVerify, codeChecker('candidate'), addCandidate);

// generate form
router.get('/:cid/form/:formId', getFormVerify, getForm);

router.get('/form/:token', newGetFormVerify, newGetForm)

router.use(authenticator);

// set candidates data
router.put('/:cid/form/:formId', setCandidateVerify, setCandidate);

router.put('/form/:token', newSetCandidateVerify, newSetCandidate);

// allocate one
router.put('/:cid/interview/:type', allocateOneVerify, allocateOne);

// allocate all
router.put('/interview/:type', allocateAllVerify, allocateAll);

// get all candidates
router.get('/:query', getCandidateVerify, getCandidates);

// get resume of a candidate
router.get('/:cid/resume', getResume);

export const candidate = router;

import express from 'express';
import { getForm, getFormVerify } from '../actions/candidate';

const router = express.Router();

// generate form
router.get('/:formId/:cid', getFormVerify, getForm);

export const form = router;

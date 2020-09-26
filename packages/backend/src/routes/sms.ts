import { Router } from 'express';
import { authenticator } from '@mw/authenticator';

import { sendCandidateCode, sendCandidateCodeVerify, sendSMS, sendSMSVerify, sendUserCode } from '../actions/sms';
import { codeChecker } from '@mw/codeChecker';

const router = Router();

// request for verification code
router.get('/verification/candidate/:phone', sendCandidateCodeVerify, sendCandidateCode);

router.use(authenticator);

// request for verification code
router.get('/verification/user', sendUserCode);

// send notification sms
router.post('/', sendSMSVerify, codeChecker('user'), sendSMS);

export const sms = router;

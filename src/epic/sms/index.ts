import { getCodeEpic } from './getVerifyCode';
import { sendInterviewEpic } from './sendInterview';
import { sendSMSEpic } from './sendSMS';

export default [sendSMSEpic, sendInterviewEpic, getCodeEpic];

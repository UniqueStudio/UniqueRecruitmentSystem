import { sendSMSEpic } from './sendSMS';
import { sendInterviewEpic } from './sendInterview';
import { getCodeEpic } from './getVerifyCode';

export default [sendSMSEpic, sendInterviewEpic, getCodeEpic];
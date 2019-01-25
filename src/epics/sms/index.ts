import { getCodeEpic } from './getVerifyCode';
import { sendSMSEpic } from './sendSMS';

export default [sendSMSEpic, getCodeEpic];

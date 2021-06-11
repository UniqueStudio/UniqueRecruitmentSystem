import { Group, Period } from '@constants/enums';

export const QR_API = 'https://open.work.weixin.qq.com/wwopen/sso';
export const WX_API = 'https://qyapi.weixin.qq.com/cgi-bin';
export const SMS_API = 'https://open.hustunique.com/sms/send_single';
export const ACM_API = 'http://acm.aliyun.com';
export const EMAIL_HOST = 'smtpdm.aliyun.com';
export const EMAIL_PORT = 465;

export const ID_GROUP_MAP: Record<number, Group> = {
    2: Group.web,
    3: Group.pm,
    4: Group.ai,
    5: Group.android,
    6: Group.game,
    7: Group.lab,
    8: Group.ios,
    9: Group.design,
    15: Group.web,
    16: Group.android,
    17: Group.ai,
    18: Group.game,
    19: Group.ios,
    20: Group.design,
    21: Group.lab,
    22: Group.lab,
    23: Group.lab,
    24: Group.lab,
    25: Group.pm,
};
export const SLOTS = {
    [Period.morning]: [9, 9.5, 10, 10.5, 11, 11.5, 8.5, 8, 7.5],
    [Period.afternoon]: [14.5, 15, 15.5, 16, 16.5, 17, 14, 13.5, 13, 12.5],
    [Period.evening]: [18.5, 19, 19.5, 20, 20.5, 21, 21.5, 18, 22],
};

export const ZHANG_XIAO_LONG = new Map<'mother', never>();

export {
    GRADES, GENDERS, STEP_SHORT_MAP, STEP_MAP, RANKS, PERIOD_MAP, GROUP_MAP,
} from '@uniqs/config';

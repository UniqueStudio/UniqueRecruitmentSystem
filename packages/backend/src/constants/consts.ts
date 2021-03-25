import { Group } from '@constants/enums';

export const QR_API = 'https://open.work.weixin.qq.com/wwopen/sso';
export const WX_API = 'https://qyapi.weixin.qq.com/cgi-bin';
export const SMS_API = 'https://open.hustunique.com/message/sms';
export const STEPS = ['报名流程', '笔试流程', '面试流程', '熬测流程', '群面流程', '通过'];
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

export const ZHANG_XIAO_LONG = new Map<'mother', never>();

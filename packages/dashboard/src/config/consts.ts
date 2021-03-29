import { Group, Period, Step } from '@config/enums';

export const GROUP_MAP = new Map([
    [Group.web, 'Web'],
    [Group.lab, 'Lab'],
    [Group.ai, 'AI'],
    [Group.game, 'Game'],
    [Group.android, 'Android'],
    [Group.ios, 'iOS'],
    [Group.design, 'Design'],
    [Group.pm, 'PM'],
]);
export const STEP_MAP = new Map([
    [Step.报名, '报名流程'],
    [Step.笔试, '笔试流程'],
    [Step.组面时间选择, '组面时间选择流程'],
    [Step.组面, '组面流程'],
    [Step.熬测, '熬测流程'],
    [Step.群面时间选择, '群面时间选择流程'],
    [Step.群面, '群面流程'],
    [Step.通过, '通过'],
]);
export const STEP_SHORT_MAP = new Map([
    [Step.报名, '报名'],
    [Step.笔试, '笔试'],
    [Step.组面时间选择, '组面时间选择'],
    [Step.组面, '组面'],
    [Step.熬测, '熬测'],
    [Step.群面时间选择, '群面时间选择'],
    [Step.群面, '群面'],
    [Step.通过, '通过'],
]);
export const PERIOD_MAP = new Map([
    [Period.morning, '上午'],
    [Period.afternoon, '下午'],
    [Period.evening, '晚上'],
]);
export const RANKS = ['暂无', '前10%', '前25%', '前50%', '前100%'];
export const GRADES = ['大一', '大二', '大三', '大四', '研一', '研二', '研三'];
export const GENDERS = ['其他', '男', '女'];
export const API = import.meta.env.SNOWPACK_PUBLIC_API || 'https://hustunique.com:5000/v3';

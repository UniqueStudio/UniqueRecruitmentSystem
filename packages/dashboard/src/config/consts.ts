import { StepType } from '@config/enums';
import { API as API_PROD } from '@uniqs/config';

export const STEP_TYPE_MAP = new Map([
    [StepType.all, '全部'],
    [StepType.groupInterview, '组面'],
    [StepType.teamInterview, '群面'],
]);
export const API = (import.meta.env.VITE_PUBLIC_API ?? API_PROD) as string;
export { GROUP_MAP, STEP_MAP, STEP_SHORT_MAP, PERIOD_MAP, RANKS, GENDERS, GRADES } from '@uniqs/config';

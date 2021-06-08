import { ApplicationStore } from './application';
import { ComponentStateStore } from './componentState';
import { MemberStore } from './member';
import { RecruitmentStore } from './recruitment';

export const stores = {
    $application: new ApplicationStore(),
    $component: new ComponentStateStore(),
    $recruitment: new RecruitmentStore(),
    $member: new MemberStore(),
};

export { ComponentStateStore, ApplicationStore, MemberStore, RecruitmentStore };

import { ApplicationStore } from './candidate';
import { ComponentStateStore } from './componentState';
import { RecruitmentStore } from './recruitment';
import { UserStore } from './user';

export const stores = {
    $application: new ApplicationStore(),
    $component: new ComponentStateStore(),
    $recruitment: new RecruitmentStore(),
    $user: new UserStore(),
};

export { ComponentStateStore, ApplicationStore, UserStore, RecruitmentStore };

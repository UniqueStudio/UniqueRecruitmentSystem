import { CandidateStore } from './candidate';
import { ComponentStateStore } from './componentState';
import { RecruitmentStore } from './recruitment';
import { UserStore } from './user';

export const stores = {
    $candidate: new CandidateStore(),
    $component: new ComponentStateStore(),
    $recruitment: new RecruitmentStore(),
    $user: new UserStore(),
};

export { ComponentStateStore, CandidateStore, UserStore, RecruitmentStore };

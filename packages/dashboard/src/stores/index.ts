import { CandidateStore } from './candidate';
import { ComponentStateStore } from './componentState';
import { RecruitmentStore } from './recruitment';
import { UserStore } from './user';

export const stores = {
    candidateStore: new CandidateStore(),
    componentStateStore: new ComponentStateStore(),
    recruitmentStore: new RecruitmentStore(),
    userStore: new UserStore(),
};

export { ComponentStateStore, CandidateStore, UserStore, RecruitmentStore };

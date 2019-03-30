import { combineReducers } from 'redux';
import { candidateReducer, CandidateStore } from './candidate';
import { componentReducer, ComponentStore } from './component';
import { recruitmentReducer, RecruitmentStore } from './recruitment';
import { userReducer, UserStore } from './user';

export interface StoreState {
    component: ComponentStore;
    candidate: CandidateStore;
    user: UserStore;
    recruitment: RecruitmentStore;
}

export const reducers = combineReducers({
    candidate: candidateReducer,
    component: componentReducer,
    recruitment: recruitmentReducer,
    user: userReducer,
});

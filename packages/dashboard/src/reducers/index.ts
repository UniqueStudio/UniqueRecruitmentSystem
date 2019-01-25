import { combineReducers } from 'redux';
import { candidateReducer, CandidateStore } from './candidate';
import { componentReducer, ComponentStore } from './component';
import { recruitmentReducer, RecruitmentStore } from './recruitment';
import { smsReducer, SmsStore } from './sms';
import { userReducer, UserStore } from './user';

export interface StoreState {
    component: ComponentStore;
    candidate: CandidateStore;
    user: UserStore;
    recruitment: RecruitmentStore;
    sms: SmsStore;
}

export const reducers = combineReducers({
    candidate: candidateReducer,
    component: componentReducer,
    recruitment: recruitmentReducer,
    sms: smsReducer,
    user: userReducer,
});

import { combineReducers } from 'redux';

import { candidates, Candidates } from './candidates';
import { components, Components } from './components';
import { recruitments, Recruitments } from './recruitments';
import { sms, Sms } from './sms';
import { user, User } from './user';

export interface StoreState {
    components: Components;
    candidates: Candidates;
    user: User;
    recruitments: Recruitments;
    sms: Sms;
}

export const reducers = combineReducers({
    components,
    candidates,
    user,
    recruitments,
    sms,
});

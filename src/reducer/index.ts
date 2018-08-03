import { components, Components } from './components';
import { candidates, Candidates } from './candidates';
import { user, User } from './user';
import { recruitments, Recruitments } from './recruitments';
import { sms, Sms } from './sms';
import { routerReducer, RouterState } from 'react-router-redux';
import { combineReducers } from 'redux';

export interface StoreState {
    components: Components;
    candidates: Candidates;
    user: User;
    recruitments: Recruitments;
    routerReducer: RouterState;
    sms: Sms;
}

export const reducers = combineReducers({
    components,
    candidates,
    user,
    recruitments,
    sms,
    routerReducer
});
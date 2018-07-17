import { components, Components } from './components';
import { candidates, Candidates } from './candidates';
import { user, User } from './user';
import { routerReducer, RouterState } from 'react-router-redux';
import { combineReducers } from 'redux';

export interface StoreState {
    components: Components;
    candidates: Candidates;
    user: User;
    routerReducer: RouterState;
}

export const reducers = combineReducers({
    components,
    candidates,
    user,
    routerReducer
});
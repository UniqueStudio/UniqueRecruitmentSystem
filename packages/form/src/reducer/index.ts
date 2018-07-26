import { combineReducers } from 'redux';
import * as actions from '../action';

export interface StoreState {
    info: object;
}

const init = {
    info: {}
};

type Actions = actions.SetInfo;

function reducer(state: StoreState = init, action: Actions): StoreState {
    switch (action.type) {
        case actions.SET_INFO:
            return { ...state, info: { ...state.info, ...action.payload}}
    }
    return state;
}

export const reducers = combineReducers({
    reducer
});
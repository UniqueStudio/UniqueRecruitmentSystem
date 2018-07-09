import { Action, TOGGLE_DRAWER_OPEN, ADD_COMMENT } from "../action";
import * as candidates from '../candidates.json';

export interface StoreState {
    drawerOpen: boolean;
    candidates: object;
}

const initialState: StoreState = {
    drawerOpen: false,
    candidates: candidates
};

export function reducer(
    state: StoreState = initialState,
    action: Action
): StoreState {
    switch (action.type) {
        case TOGGLE_DRAWER_OPEN:
            return { ...state, drawerOpen: !state.drawerOpen };
        case ADD_COMMENT:
            const newState = { ...state };
            newState.candidates[action.step][action.name].comments[action.commenter] =
                action.comment;
            return newState;
    }
    return state;
}

import { Action, TOGGLE_DRAWER_OPEN } from '../action';
import { StoreState } from '../type';

const initialState: StoreState = {
    drawerOpen: false,
};

export function reducer(state: StoreState = initialState, action: Action) : StoreState {
    switch (action.type) {
        case TOGGLE_DRAWER_OPEN:
            return { ...state, drawerOpen: !state.drawerOpen };
    }
    return state;
}

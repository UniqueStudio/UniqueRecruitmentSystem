import { StoreState } from './index';
import * as actions from '../action';

const init = {
    drawerOpen: false,
    snackbar: {
        on: false,
        info: '',
    },
};

type Action = actions.ToggleSnackbarOn | actions.ToggleDrawerOpen;

export default function components(
    state: StoreState['components'] = init,
    action: Action
): StoreState['components'] {
    switch (action.type) {
        case actions.TOGGLE_DRAWER_OPEN:
            return { ...state, drawerOpen: !state.drawerOpen };
        case actions.TOGGLE_SNACKBAR_ON:
            return { ...state, snackbar: { on: !state.snackbar.on, info: action.info || '' } };
    }
    return state;
}
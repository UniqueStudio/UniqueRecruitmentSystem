import * as actions from '../action';

const init = {
    drawerOpen: false,
    snackbar: {
        on: false,
        info: '',
        color: ''
    },
};

type Action = actions.ToggleSnackbarOn | actions.ToggleSnackbarOff | actions.ToggleDrawerOpen;

export interface Components {
    drawerOpen: boolean;
    snackbar: {
        on: boolean;
        info: string;
        color: string;
    };
}

export function components(
    state: Components = init,
    action: Action
): Components {
    switch (action.type) {
        case actions.TOGGLE_DRAWER_OPEN:
            return { ...state, drawerOpen: !state.drawerOpen };
        case actions.TOGGLE_SNACKBAR_ON:
            return { ...state, snackbar: { on: true, info: action.info, color: action.color } };
        case actions.TOGGLE_SNACKBAR_OFF:
            return { ...state, snackbar: { ...state.snackbar, on: false } };
    }
    return state;
}
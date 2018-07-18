import * as actions from '../action';

const init = {
    drawerOpen: false,
    snackbar: {
        on: false,
        info: '',
        color: ''
    },
    modalOn: '',
};

type Action =
    actions.ToggleSnackbarOn
    | actions.ToggleSnackbarOff
    | actions.ToggleDrawerOpen
    | actions.ToggleModalOn
    | actions.ToggleModalOff;

export interface Components {
    drawerOpen: boolean;
    snackbar: {
        on: boolean;
        info: string;
        color: string;
    };
    modalOn: string;
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
        case actions.TOGGLE_MODAL_ON:
            return { ...state, modalOn: action.cid };
        case actions.TOGGLE_MODAL_OFF:
            return { ...state, modalOn: '' };
    }
    return state;
}
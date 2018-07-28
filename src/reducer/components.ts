import * as actions from '../action';

const init = {
    drawerOpen: false,
    snackbar: {
        on: false,
        info: '',
        color: ''
    },
    modalOn: '',
    fabOn: -1,
};

type Action =
    actions.ToggleSnackbarOn
    | actions.ToggleSnackbarOff
    | actions.ToggleDrawerOpen
    | actions.ToggleModalOn
    | actions.ToggleModalOff
    | actions.ToggleFabOn
    | actions.ToggleFabOff;

export interface Components {
    drawerOpen: boolean;
    snackbar: {
        on: boolean;
        info: string;
        color: string;
    };
    modalOn: string;
    fabOn: number;
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
        case actions.TOGGLE_FAB_ON:
            return { ...state, fabOn: action.step };
        case actions.TOGGLE_FAB_OFF:
            return { ...state, fabOn: -1 };
    }
    return state;
}
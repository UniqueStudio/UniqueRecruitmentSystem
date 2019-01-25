import * as actions from 'Actions';

type Action =
    actions.EnqueueSnackbar
    | actions.RemoveSnackbar
    | actions.ToggleDrawerOpen
    | actions.ToggleFabOn
    | actions.ToggleFabOff;

export interface ComponentStore {
    drawerOpen: boolean;
    snackbars: actions.EnqueueSnackbar['notification'][];
    modalOn: string;
    fabOn: number;
}

const init: ComponentStore = {
    drawerOpen: false,
    snackbars: [],
    modalOn: '',
    fabOn: -1,
};

export function componentReducer(state = init, action: Action): ComponentStore {
    switch (action.type) {
        case actions.TOGGLE_DRAWER_OPEN:
            return { ...state, drawerOpen: !state.drawerOpen };
        case actions.ENQUEUE_SNACKBAR:
            return { ...state, snackbars: [...state.snackbars, { ...action.notification }] };
        case actions.REMOVE_SNACKBAR:
            return { ...state, snackbars: state.snackbars.filter((snackbar) => snackbar.key !== action.key) };
        case actions.TOGGLE_FAB_ON:
            return { ...state, fabOn: action.step };
        case actions.TOGGLE_FAB_OFF:
            return { ...state, fabOn: -1 };
    }
    return state;
}

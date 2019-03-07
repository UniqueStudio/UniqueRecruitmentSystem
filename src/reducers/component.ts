import * as actions from '../actions';

type Action =
    actions.EnqueueSnackbar
    | actions.RemoveSnackbar
    | actions.ToggleDrawer
    | actions.ToggleProgress
    | actions.ToggleFabOn
    | actions.ToggleFabOff
    | actions.ResumeProgress;

export interface ComponentStore {
    drawerOpen: boolean;
    snackbars: actions.EnqueueSnackbar['notification'][];
    fabOn: number;
    progressOn: boolean;
    resume: {
        progress: number;
        cid: string;
    };
}

const init: ComponentStore = {
    progressOn: false,
    drawerOpen: false,
    snackbars: [],
    fabOn: -1,
    resume: {
        progress: 0,
        cid: '',
    }
};

export function componentReducer(state = init, action: Action): ComponentStore {
    switch (action.type) {
        case actions.TOGGLE_PROGRESS:
            return { ...state, progressOn: action.on };
        case actions.TOGGLE_DRAWER:
            return { ...state, drawerOpen: !state.drawerOpen };
        case actions.ENQUEUE_SNACKBAR:
            return { ...state, snackbars: [...state.snackbars, { ...action.notification }] };
        case actions.REMOVE_SNACKBAR:
            return { ...state, snackbars: state.snackbars.filter((snackbar) => snackbar.key !== action.key) };
        case actions.TOGGLE_FAB_ON:
            return { ...state, fabOn: action.step };
        case actions.TOGGLE_FAB_OFF:
            return { ...state, fabOn: -1 };
        case actions.RESUME_PROGRESS:
            const { progress, cid } = action;
            return { ...state, resume: { progress, cid } };
    }
    return state;
}

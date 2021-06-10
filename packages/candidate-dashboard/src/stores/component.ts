import { Color } from '@material-ui/lab';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Snackbar {
    message: string;
    variant: Color;
}

interface ComponentState {
    snackbars: Record<string, Snackbar>;
    layout: {
        title: string;
    };
}

const initialState: ComponentState = {
    snackbars: {

    },
    layout: {
        title: '',
    },
};

const { reducer, actions } = createSlice({
    name: 'component',
    initialState,
    reducers: {
        enqueueSnackbar(state, { payload }: PayloadAction<Snackbar>) {
            state.snackbars[performance.now()] = payload;
        },
        removeSnackbar(state, { payload }: PayloadAction<string>) {
            delete state.snackbars[payload];
        },
        setLayoutTitle(state, { payload }: PayloadAction<string>) {
            state.layout.title = payload;
        },
    },
});

export default reducer;
export const { enqueueSnackbar, removeSnackbar, setLayoutTitle } = actions;

import { Color } from '@material-ui/lab';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Snackbar {
    message: string;
    variant: Color;
}

interface ComponentState {
    snackbars: Record<string, Snackbar>;
    progress: number;
}

const initialState: ComponentState = {
    snackbars: {},
    progress: 0,
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
        setProgress(state, { payload }: PayloadAction<number>) {
            state.progress = payload;
        },
    },
});

export default reducer;
export const { enqueueSnackbar, removeSnackbar, setProgress } = actions;

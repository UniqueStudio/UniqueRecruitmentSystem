import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Status } from '@uniqs/config';

interface Snackbar {
    message: string;
    variant: Status;
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
        enqueueSnackbar(state, { payload: [message, variant] }: PayloadAction<[string, Status]>) {
            state.snackbars[performance.now()] = { message, variant };
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

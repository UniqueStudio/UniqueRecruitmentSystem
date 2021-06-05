import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnackbarState } from 'components/Snackbar';

interface ComponentState {
    snackbar: SnackbarState;
    layout: {
        title: string;
    };
}

const initialState: ComponentState = {
    snackbar: {
        type: undefined,
        message: undefined,
        _key: undefined,
    },
    layout: {
        title: '',
    },
};

const componentSlice = createSlice({
    name: 'component',
    initialState,
    reducers: {
        showSnackbar: (state, action: PayloadAction<SnackbarState>) => {
            state.snackbar = action.payload;
        },
        resetSnackbar: (state) => {
            state.snackbar = { ...initialState.snackbar };
        },
        setLayoutTitle: (state, action: PayloadAction<string>) => {
            state.layout.title = action.payload;
        },
    },
});

export default componentSlice.reducer;
export const { showSnackbar, resetSnackbar, setLayoutTitle } = componentSlice.actions;

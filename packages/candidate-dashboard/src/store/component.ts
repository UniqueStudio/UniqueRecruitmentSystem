import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnackbarState } from 'components/Snackbar';

interface ComponentState {
  snackbar: SnackbarState;
}

const initialState: ComponentState = {
  snackbar: {
    type: undefined,
    message: undefined,
    _key: undefined,
  },
};

const componentSlice = createSlice({
  name: 'component',
  initialState: initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<SnackbarState>) => {
      state.snackbar = action.payload;
    },
    resetSnackbar: (state) => {
      state.snackbar = { ...initialState.snackbar };
    },
  },
});

export default componentSlice.reducer;
export const { showSnackbar, resetSnackbar } = componentSlice.actions;

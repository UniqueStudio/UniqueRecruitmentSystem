import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CandidateState {
    token: string;
}

const initialState: CandidateState = {
    token: '',
};

const { reducer, actions } = createSlice({
    name: 'component',
    initialState,
    reducers: {
        setToken(state, { payload }: PayloadAction<string>) {
            state.token = payload;
        },
    },
});

export default reducer;
export const { setToken } = actions;

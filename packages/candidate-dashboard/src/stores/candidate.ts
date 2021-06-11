import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate } from '@uniqs/config';

interface CandidateState {
    token: string;
    info?: Candidate;
}

const initialState: CandidateState = {
    token: '',
};

const { reducer, actions } = createSlice({
    name: 'candidate',
    initialState,
    reducers: {
        setToken(state, { payload }: PayloadAction<string>) {
            state.token = payload;
        },
        setInfo(state, { payload }: PayloadAction<Candidate>) {
            state.info = payload;
        },
    },
});

export default reducer;
export const { setToken, setInfo } = actions;

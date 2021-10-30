import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Application, Interview } from '@uniqs/config';

interface ApplicationState {
    current?: Application;
}

const initialState: ApplicationState = {
    current: {} as Application,
};

const { reducer, actions } = createSlice({
    name: 'application',
    initialState,
    reducers: {
        setApplication(state, { payload }: PayloadAction<Partial<Application>>) {
            Object.assign(state.current, payload);
        },
        selectInterview(state, { payload }: PayloadAction<Interview[]>) {
            if (!state.current) {
                return;
            }
            state.current.interviewSelections = payload;
        },
    },
});

export default reducer;
export const { setApplication, selectInterview } = actions;

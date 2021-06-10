import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recruitment } from '@uniqs/api';

interface RecruitmentState {
    recruitments: Record<string, Recruitment>;
    viewingId: string;
}

const initialState: RecruitmentState = {
    recruitments: {},
    viewingId: '',
};

const recruitmentSlice = createSlice({
    name: 'recruitment',
    initialState,
    reducers: {
        setRecruitments: (state, { payload }: PayloadAction<Record<string, Recruitment>>) => {
            state.recruitments = payload;
        },
    },
});

export default recruitmentSlice.reducer;
export const { setRecruitments } = recruitmentSlice.actions;

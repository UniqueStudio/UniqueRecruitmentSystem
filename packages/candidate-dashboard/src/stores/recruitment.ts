import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recruitment } from '@uniqs/config';

interface RecruitmentState {
    recruitments: Recruitment[];
}

const initialState: RecruitmentState = {
    recruitments: [],
};

const recruitmentSlice = createSlice({
    name: 'recruitment',
    initialState,
    reducers: {
        setRecruitments: (state, { payload }: PayloadAction<Recruitment[]>) => {
            state.recruitments = payload;
        },
    },
});

export default recruitmentSlice.reducer;
export const { setRecruitments } = recruitmentSlice.actions;

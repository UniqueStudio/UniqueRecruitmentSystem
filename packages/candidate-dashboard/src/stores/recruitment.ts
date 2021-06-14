import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Interview, Recruitment } from '@uniqs/config';

interface RecruitmentState {
    recruitments: Recruitment[];
    interviews: Interview[];
}

const initialState: RecruitmentState = {
    recruitments: [],
    interviews: [],
};

const recruitmentSlice = createSlice({
    name: 'recruitment',
    initialState,
    reducers: {
        setRecruitments: (state, { payload }: PayloadAction<Recruitment[]>) => {
            state.recruitments = payload;
        },
        setInterviews: (state, { payload }: PayloadAction<Interview[]>) => {
            state.interviews = payload;
        },
    },
});

export default recruitmentSlice.reducer;
export const { setRecruitments, setInterviews } = recruitmentSlice.actions;

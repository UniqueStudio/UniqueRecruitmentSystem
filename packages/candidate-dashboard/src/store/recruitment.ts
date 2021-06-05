import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecruitmentState {
    title: string;
    begin: number;
    stop: number;
    end: number;
}

const initialState: RecruitmentState = {
    title: '',
    begin: 0,
    stop: 0,
    end: 0,
};

const recruitmentSlice = createSlice({
    name: 'recruitment',
    initialState,
    reducers: {
        setRecruitmentState: (state, action: PayloadAction<RecruitmentState>) => {
            state = { ...action.payload };
        },
    },
});

export default recruitmentSlice.reducer;
export const { setRecruitmentState } = recruitmentSlice.actions;

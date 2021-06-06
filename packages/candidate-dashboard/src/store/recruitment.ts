import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recruitment } from '@uniqs/api';

const initialState: Recruitment = {
    id: '',
    name: '',
    beginning: new Date(0),
    deadline: new Date(0),
    end: new Date(0),
    interviews: [],
};

const recruitmentSlice = createSlice({
    name: 'recruitment',
    initialState,
    reducers: {
        setRecruitmentState: (state, action: PayloadAction<Recruitment>) => {
            state = { ...action.payload };
        },
    },
});

export default recruitmentSlice.reducer;
export const { setRecruitmentState } = recruitmentSlice.actions;

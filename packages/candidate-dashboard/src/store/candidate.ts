import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate, isSuccess, SetCandidateInfo } from '@uniqs/api';
import { Group } from '@uniqs/config';

import { showSnackbar } from './component';

import { RootState } from './index';

import { getCandidateInfo, getInterviewSlots, submitCandidateForm } from 'services';

const initialState: Candidate = {
    id: '',
    name: '',
    gender: 0,
    grade: 0,
    institute: '',
    major: '',
    rank: 0,
    mail: '',
    phone: '',
    group: Group.web,
    intro: '',
    isQuick: false,
    referrer: '',
    resume: '',
    abandoned: false,
    rejected: false,
    interviewAllocations: {},
    interviewSelections: [],
    step: 0,
    updatedAt: new Date(0),
    comments: [],
};

const fetchCandidate = createAsyncThunk('candidate/fetch', async (_, { rejectWithValue, dispatch }) => {
    const res = await getCandidateInfo();

    if (isSuccess(res)) {
        return res.payload;
    }

    dispatch(showSnackbar({ type: res.status, message: res.message }));

    return rejectWithValue(res.message);
});

const updateCandidate = createAsyncThunk<
    void,
    SetCandidateInfo,
    {
        rejectValue: string;
    }
>('candidate/update', async ({ resume: fileList, ...form }, { rejectWithValue, dispatch, getState }) => {
    let resume: File | string = '';
    if (fileList instanceof File) {
        resume = fileList;
    } else if (fileList instanceof FileList) {
        [resume] = fileList;
    }
    const { recruitment } = getState() as RootState;
    // use deconstract to omit values
    const res = await submitCandidateForm({ ...form, resume, name: recruitment.name }, true);

    if (isSuccess(res)) {
        dispatch(showSnackbar({ type: 'success', message: '修改成功' }));
        return;
    }
    const { status, message } = res;
    dispatch(showSnackbar({ type: status, message }));

    return rejectWithValue(message);
});

const fetchInterviewSlots = createAsyncThunk('candidate/fetch/slots', async (_, { rejectWithValue }) => {
    const res = await getInterviewSlots();

    if (isSuccess(res)) {
        return res.payload;
    }

    return rejectWithValue(res.message);
});

const candidateSlice = createSlice({
    name: 'candidate',
    initialState,
    reducers: {
        setCandidate(state, { payload }: PayloadAction<Candidate>) {
            return { ...state, ...payload };
        },
    },
    /**
     * @see https://redux-toolkit.js.org/usage/usage-with-typescript#type-safety-with-extrareducers
     */
    extraReducers: (builder) => {
        builder
            .addCase(fetchCandidate.fulfilled, (state, { payload }) => ({ ...state, ...payload }))
            .addCase(fetchCandidate.rejected, (_, { payload }) => {
                if (payload === 'JWT is invalid!') {
                    // TODO: find better solution
                    window.location.href = '/login';
                }
            })
            .addCase(updateCandidate.rejected, () => {
                //
            })
            .addCase(updateCandidate.fulfilled, () => {
                //
            })
            .addCase(fetchInterviewSlots.fulfilled, () => {
                //
            })
            .addCase(fetchInterviewSlots.rejected, () => {
                //
            });
    },
});

export default candidateSlice.reducer;
export const { setCandidate } = candidateSlice.actions;
export { fetchCandidate, updateCandidate };

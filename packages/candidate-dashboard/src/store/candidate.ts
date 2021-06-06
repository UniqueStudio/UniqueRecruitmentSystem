import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { showSnackbar } from './component';

import { RootState } from './index';

import { Candidate, CandidateForm } from 'config/types';
import { getCandidateInfo, submitCandidateForm } from 'services';

const initialState: Candidate = {
    name: '',
    gender: 0,
    grade: 0,
    institute: '',
    major: '',
    rank: 0,
    mail: '',
    phone: '',
    group: 'web',
    title: '',
    intro: '',
    isQuick: false,
    referrer: '',
    resume: '',
    abandon: false,
    rejected: false,
    interviews: {
        group: {
            selection: [],
            allocation: 0,
        },
        team: {
            selection: [],
            allocation: 0,
        },
    },
    step: 0,
};

interface SetFieldPayload {
    key: keyof CandidateForm;
    value: CandidateForm[keyof CandidateForm];
}

const fetchCandidate = createAsyncThunk<
    Candidate,
    void,
    {
        rejectValue: string;
    }
>('candidate/fetch', async (_, { rejectWithValue, dispatch }) => {
    const { type, message, data } = await getCandidateInfo();

    if (type === 'success') {
        return data;
    }

    dispatch(showSnackbar({ type, message }));

    return rejectWithValue(message ?? '网络错误');
});

const updateCandidate = createAsyncThunk<
    void,
    Partial<CandidateForm>,
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
    const { recruitment, candidate } = getState() as RootState;
    // use deconstract to omit values
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { abandon, rejected, interviews, step, ...stateForm } = candidate;
    const { type, message } = await submitCandidateForm(
        { ...stateForm, ...form, resume, title: recruitment.title },
        true,
    );

    if (type === 'success') {
        dispatch(showSnackbar({ type: 'success', message: '修改成功' }));
        return;
    }
    dispatch(showSnackbar({ type, message }));

    return rejectWithValue(message ?? '网络错误');
});

const candidateSlice = createSlice({
    name: 'candidate',
    initialState,
    reducers: {
        setCandidate(state, { payload }: PayloadAction<CandidateForm>) {
            return { ...state, ...payload };
        },
        setCandidateField(state, { payload }: PayloadAction<SetFieldPayload>) {
            return { ...state, [payload.key]: payload.value };
        },
    },
    /**
     * @see https://redux-toolkit.js.org/usage/usage-with-typescript#type-safety-with-extrareducers
     */
    extraReducers: (builder) => {
        builder
            .addCase(fetchCandidate.fulfilled, (_, { payload }) => payload)
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
            });
    },
});

export default candidateSlice.reducer;
export const { setCandidate, setCandidateField } = candidateSlice.actions;
export { fetchCandidate, updateCandidate };

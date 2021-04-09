import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate, CandidateForm, isSuccess } from '@uniqs/api';
import { Group } from '@uniqs/config';
import { getCandidateInfo, getInterviewSlots, submitCandidateForm } from 'services';
import { showSnackbar } from './component';

import type { RootState } from './index';

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

type SetFieldPayload = {
  key: keyof CandidateForm;
  value: CandidateForm[keyof CandidateForm];
};

const fetchCandidate = createAsyncThunk<CandidateForm, void, { rejectValue: string }>(
  'candidate/fetch',
  async (_, { rejectWithValue, dispatch }) => {
    const res = await getCandidateInfo();

    if (isSuccess(res)) {
      return res.payload;
    }

    dispatch(showSnackbar({ type: res.status, message: res.message }));

    return rejectWithValue(res.message ?? '网络错误');
  },
);

const updateCandidate = createAsyncThunk<
  void,
  CandidateForm,
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

  return rejectWithValue(message ?? '网络错误');
});

const fetchInterviewSlots = createAsyncThunk('candidate/fetch/slots', async (_, { rejectWithValue }) => {
  const res = await getInterviewSlots();

  if (isSuccess(res)) {
    return res.payload;
  }

  return rejectWithValue(res.message ?? '网络错误');
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
export const { setCandidate, setCandidateField } = candidateSlice.actions;
export { fetchCandidate, updateCandidate };

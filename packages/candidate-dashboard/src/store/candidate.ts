import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate, CandidateForm } from 'config/types';
import { getCandidateInfo } from 'services';
import { showSnackbar } from './component';

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

type SetFieldPayload = {
  key: keyof CandidateForm;
  value: CandidateForm[keyof CandidateForm];
};

const fetchCandidate = createAsyncThunk<
  Candidate,
  void,
  {
    rejectValue: string;
  }
>('candidate/fetch', async (_, { rejectWithValue, dispatch }) => {
  const { type, message, ...candidate } = await getCandidateInfo();

  if (type === 'success') {
    return candidate;
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
      .addCase(fetchCandidate.fulfilled, (_, action) => {
        return action.payload;
      })
      .addCase(fetchCandidate.rejected, (_, { payload }) => {
        if (payload === 'JWT is invalid!') {
          // TODO: find better solution
          window.location.href = '/login';
        }
      });
  },
});

export default candidateSlice.reducer;
export const { setCandidate, setCandidateField } = candidateSlice.actions;
export { fetchCandidate };

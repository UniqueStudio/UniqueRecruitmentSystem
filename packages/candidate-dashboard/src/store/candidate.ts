import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate, CandidateForm } from 'config/types';

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
});

export default candidateSlice.reducer;
export const { setCandidate, setCandidateField } = candidateSlice.actions;

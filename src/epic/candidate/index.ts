import { getCandidatesEpic } from './getCandidates';
import { getResumeEpic } from './getResume';
import { removeCandidateEpic } from './removeCandidate';

import { actionTypeCreator } from '../index';

export const CANDIDATE = actionTypeCreator('CANDIDATE');

export interface CandidateAction {
    type: string
}


export default [getCandidatesEpic, getResumeEpic, removeCandidateEpic];
import { getCandidatesEpic } from './getCandidates';
import { getResumeEpic } from './getResume';
import { removeCandidateEpic } from './removeCandidate';
import { moveCandidateEpic } from './moveCandidate';
import { addCommentEpic } from './addComment';
import { removeCommentEpic } from './removeComment';
import { submitSlotsEpic } from './submitSlots';

export default [
    getCandidatesEpic,
    getResumeEpic,
    removeCandidateEpic,
    moveCandidateEpic,
    addCommentEpic,
    removeCommentEpic,
    submitSlotsEpic
];
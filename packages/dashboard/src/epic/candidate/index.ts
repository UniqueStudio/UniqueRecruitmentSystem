import { addCommentEpic } from './addComment';
import { getCandidatesEpic } from './getCandidates';
import { getResumeEpic } from './getResume';
import { moveCandidateEpic } from './moveCandidate';
import { removeCandidateEpic } from './removeCandidate';
import { removeCommentEpic } from './removeComment';
import { setAllSlotsEpic } from './setAllSlots';
import { setOneSlotEpic } from './setOneSlot';

export default [
    getCandidatesEpic,
    getResumeEpic,
    removeCandidateEpic,
    moveCandidateEpic,
    addCommentEpic,
    removeCommentEpic,
    setAllSlotsEpic,
    setOneSlotEpic,
];

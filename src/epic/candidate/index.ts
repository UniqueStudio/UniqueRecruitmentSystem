import { getCandidatesEpic } from './getCandidates';
import { getResumeEpic } from './getResume';
import { removeCandidateEpic } from './removeCandidate';
import { moveCandidateEpic } from './moveCandidate';
import { addCommentEpic } from './addComment';
import { removeCommentEpic } from './removeComment';
import { setAllSlotsEpic } from './setAllSlots';
import { setOneSlotEpic } from "./setOneSlot";

export default [
    getCandidatesEpic,
    getResumeEpic,
    removeCandidateEpic,
    moveCandidateEpic,
    addCommentEpic,
    removeCommentEpic,
    setAllSlotsEpic,
    setOneSlotEpic
];
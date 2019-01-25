import { addCommentEpic } from './addComment';
import { allocateAllEpic } from './allocateAll';
import { allocateOneEpic } from './allocateOne';
import { getCandidatesEpic } from './getCandidates';
import { getResumeEpic } from './getResume';
import { moveCandidateEpic } from './moveCandidate';
import { removeCandidateEpic } from './removeCandidate';
import { removeCommentEpic } from './removeComment';

export default [
    getCandidatesEpic,
    getResumeEpic,
    removeCandidateEpic,
    moveCandidateEpic,
    addCommentEpic,
    removeCommentEpic,
    allocateAllEpic,
    allocateOneEpic,
];

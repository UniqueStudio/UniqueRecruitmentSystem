import * as actions from '../actions';

import { Candidate, Evaluation, Group, Step } from '../config/types';
import { insertItem, removeItem, updateObjectInArray } from '../utils/reducerHelper';

import { updateStorage } from '../utils/updateStorage';

const update = updateStorage('candidates');

type Action =
    | actions.AddCandidateFulfilled
    | actions.AddCommentFulfilled
    | actions.DeselectCandidate
    | actions.GetCandidatesFulfilled
    | actions.MoveCandidateFulfilled
    | actions.RecordInputtingComment
    | actions.RemoveCandidateFulfilled
    | actions.RemoveCommentFulfilled
    | actions.SelectCandidate
    | actions.SetGroup
    | actions.SetSteps
    | actions.AllocateOneFulfilled
    | actions.AllocateAllFulfilled;

export interface CandidateStore {
    candidates: Candidate[];
    selected: string[];
    group: Group;
    steps: Step[];
    inputtingComment: {
        content: string;
        evaluation: Evaluation;
    };
}

const init: CandidateStore = {
    candidates: [],
    selected: [],
    group: 'web',
    steps: [0, 1, 2, 3, 4, 5],
    inputtingComment: {
        content: '',
        evaluation: 2,
    },
};

export function candidateReducer(state = init, action: Action): CandidateStore {
    switch (action.type) {
        case actions.ADD_COMMENT_FULFILLED: {
            const { candidates } = state;
            const index = candidates.findIndex(({ _id }) => _id === action.cid);
            if (index === -1) return state;
            const { comments } = candidates[index];
            const updatedComments = insertItem(comments, comments.length, action.comment);
            const updatedCandidates = updateObjectInArray(state.candidates, index, { comments: updatedComments });
            update(updatedCandidates);
            return {
                ...state,
                candidates: updatedCandidates,
                inputtingComment: {
                    content: '',
                    evaluation: 2,
                },
            };
        }
        case actions.REMOVE_COMMENT_FULFILLED: {
            const { candidates } = state;
            const index = candidates.findIndex(({ _id }) => _id === action.cid);
            if (index === -1) return state;
            const { comments } = candidates[index];
            const commentIndex = comments.findIndex(({ _id }) => _id === action.id);
            if (commentIndex === -1) return state;
            const updatedComments = removeItem(comments, commentIndex);
            const updatedCandidates = updateObjectInArray(state.candidates, index, { comments: updatedComments });
            update(updatedCandidates);
            return { ...state, candidates: updatedCandidates };
        }
        case actions.GET_CANDIDATES_FULFILLED: {
            const { candidates } = action;
            update(candidates);
            return { ...state, candidates, selected: [] };
        }
        case actions.ADD_CANDIDATE_FULFILLED: {
            const { candidates } = state;
            const updatedCandidates = insertItem(candidates, candidates.length, action.candidate);
            update(updatedCandidates);
            return { ...state, candidates: updatedCandidates };
        }
        case actions.SELECT_CANDIDATE:
            return { ...state, selected: [...new Set(state.selected.concat(action.cid))] };
        case actions.DESELECT_CANDIDATE:
            return { ...state, selected: state.selected.filter((cid) => !action.cid.includes(cid)) };
        case actions.REMOVE_CANDIDATE_FULFILLED: {
            const candidates = state.candidates.filter(({ _id }) => !action.cid.includes(_id));
            const selected = state.selected.filter((cid) => !action.cid.includes(cid));
            update(candidates);
            return { ...state, candidates, selected };
        }
        case actions.MOVE_CANDIDATE_FULFILLED: {
            const candidates = state.candidates.map((candidate) => candidate._id === action.cid ? { ...candidate, step: action.to } : candidate);
            update(candidates);
            return { ...state, candidates };
        }
        case actions.SET_GROUP:
            return { ...state, group: action.group };
        case actions.SET_STEPS:
            return { ...state, steps: action.stepType === 1 ? [4, 5] : [0, 1, 2, 3, 4, 5] };
        case actions.ALLOCATE_ONE_FULFILLED: {
            const { interviewType, time, cid: candidateId } = action;
            const { candidates } = state;
            const index = candidates.findIndex(({ _id }) => _id === candidateId);
            if (index === -1) return state;
            const { interviews } = candidates[index];
            const updatedCandidates = updateObjectInArray(candidates, index, {
                interviews: {
                    ...interviews,
                    [interviewType]: {
                        ...interviews[interviewType],
                        allocation: time,
                    },
                },
            });
            update(updatedCandidates);
            return { ...state, candidates: updatedCandidates };
        }
        case actions.ALLOCATE_ALL_FULFILLED: {
            const { data, interviewType } = action;
            const { candidates } = state;
            const updatedCandidates = candidates.map((candidate) => {
                const result = data.find(({ id }) => id === candidate._id);
                if (!result) {
                    return candidate;
                }
                const { interviews } = candidate;
                return {
                    ...candidate,
                    interviews: {
                        ...interviews,
                        [interviewType]: {
                            ...interviews[interviewType],
                            allocation: result.time,
                        },
                    },
                };
            });

            update(updatedCandidates);
            return { ...state, candidates: updatedCandidates };
        }
        case actions.RECORD_INPUTTING_COMMENT: {
            const { evaluation, content } = action;
            return { ...state, inputtingComment: { evaluation, content } };
        }
    }
    return state;
}

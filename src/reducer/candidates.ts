import * as actions from '../action';
import { CANDIDATE, COMMENT } from '../epic';
import { Candidate } from '../lib/const';
import mapToObj from '../lib/mapToObj';

const user = localStorage.getItem('userInfo');
const group = user && JSON.parse(user) && JSON.parse(user).group;

const init = {
    candidates: [],
    selected: [],
    isLoading: {
        comments: false,
        candidates: false
    },
    group: group || 'web',
    inputtingComment: {
        comment: '',
        evaluation: '',
    },
    shouldUpdateCandidates: false
};

type Action =
    actions.AddCommentFulfilled
    | actions.RemoveCommentFulfilled
    | actions.SetCandidates
    | actions.AddCandidate
    | actions.SelectCandidate
    | actions.DeselectCandidate
    | actions.RemoveCandidateFulfilled
    | actions.MoveCandidateFulfilled
    | actions.SetGroup
    | actions.SetSlots
    | actions.InputtingComment;

export interface Candidates {
    candidates: Map<string, Candidate>[];
    selected: string[];
    isLoading: {
        comments: boolean;
        candidates: boolean;
    };
    group: string;
    inputtingComment: {
        comment: string;
        evaluation: string;
    },
    shouldUpdateCandidates: boolean;
}

export function candidates(
    state: Candidates = init,
    action: Action
): Candidates {
    const newState = { ...state };
    switch (action.type) {
        case COMMENT.START:
            newState.isLoading.comments = true;
            return newState;
        case COMMENT.SUCCESS:
        case COMMENT.FAILURE:
            newState.isLoading.comments = false;
            return newState;
        case actions.ADD_COMMENT_FULFILLED:
            if (!newState.candidates[action.step] || !newState.candidates[action.step].get(action.cid)) {
                return newState;
            }
            newState.candidates[action.step].get(action.cid)!.comments[action.commenter] = action.comment;
            newState.inputtingComment = {
                comment: '',
                evaluation: '',
            };
            sessionStorage.setItem(newState.group, JSON.stringify(newState.candidates.map(i => mapToObj(i))));
            if (newState.group === 'interview') {
                newState.shouldUpdateCandidates = true
            }
            return newState;
        case actions.REMOVE_COMMENT_FULFILLED:
            if (!newState.candidates[action.step] || !newState.candidates[action.step].get(action.cid)) {
                return newState;
            }
            delete newState.candidates[action.step].get(action.cid)!.comments[action.commenter];
            sessionStorage.setItem(newState.group, JSON.stringify(newState.candidates.map(i => mapToObj(i))));
            if (newState.group === 'interview') {
                newState.shouldUpdateCandidates = true
            }
            return newState;
        case CANDIDATE.START:
            newState.isLoading.candidates = true;
            return newState;
        case CANDIDATE.SUCCESS:
        case CANDIDATE.FAILURE:
            newState.isLoading.candidates = false;
            return newState;
        case actions.SET_CANDIDATES:
            const candidatesToMap = action.candidates.map(i => new Map(Object.entries(i)));
            return { ...state, candidates: candidatesToMap, shouldUpdateCandidates: false };
        case actions.ADD_CANDIDATE:
            if (newState.group === action.candidate['group']) {
                if (!newState.candidates[action.candidate['step']]) newState.candidates[action.candidate['step']] = new Map<string, Candidate>();
                newState.candidates[action.candidate['step']].set(action.candidate['_id'], action.candidate as Candidate);
                sessionStorage.setItem(newState.group, JSON.stringify(newState.candidates.map(i => mapToObj(i))));
            }
            return newState;
        case actions.SELECT_CANDIDATE:
            newState.selected = [...new Set(newState.selected.concat(action.cid))];
            return newState;
        case actions.DESELECT_CANDIDATE:
            newState.selected = newState.selected.filter((i: string) => !action.cid.includes(i));
            return newState;
        case actions.REMOVE_CANDIDATE_FULFILLED:
            newState.candidates.map(step =>
                typeof action.cid === 'string'
                    ? step.delete(action.cid)
                    : action.cid.map(i => step.delete(i)));
            newState.selected = newState.selected.filter((i: string) => !action.cid.includes(i));
            sessionStorage.setItem(newState.group, JSON.stringify(newState.candidates.map(i => mapToObj(i))));
            newState.shouldUpdateCandidates = true;
            return newState;
        case actions.MOVE_CANDIDATE_FULFILLED:
            if (!newState.candidates[action.from] || !newState.candidates[action.from].get(action.cid)) return newState;
            const info = { ...newState.candidates[action.from].get(action.cid) } as Candidate;
            newState.candidates[action.from].delete(action.cid);
            if (!newState.candidates[action.to]) {
                newState.candidates[action.to] = new Map<string, Candidate>();
            }
            if (action.position !== undefined) {
                const entries = [...newState.candidates[action.to].entries()];
                entries.splice(action.position, 0, [action.cid, info]);
                newState.candidates[action.to] = new Map<string, Candidate>(entries);
            } else {
                newState.candidates[action.to].set(action.cid, info);
            }
            sessionStorage.setItem(newState.group, JSON.stringify(newState.candidates.map(i => mapToObj(i))));
            newState.shouldUpdateCandidates = true;
            return newState;
        case actions.SET_GROUP:
            return { ...state, group: action.group };
        case actions.INPUTTING_COMMENT:
            return { ...state, inputtingComment: { evaluation: action.evaluation, comment: action.comment } };
        case actions.SET_SLOTS:
            action.slot.map(i => {
                const candidates = newState.candidates[action.interview === 1 ? 2 : 4];
                const info = candidates.get(i['_id']);
                candidates.set(i['_id'], {
                    ...info,
                    [`slot${action.interview}`]: i[`slot${action.interview}`]
                } as Candidate);
            });
            sessionStorage.setItem(newState.group, JSON.stringify(newState.candidates.map(i => mapToObj(i))));
            return newState;
    }
    return state;
}
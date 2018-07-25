import * as actions from '../action';
import * as asyncActions from '../action/async';
import { Candidate } from '../lib/const';
import mapToObj from '../lib/mapToObj';

const init = {
    candidates: [],
    selected: [],
    isLoading: {
        comments: false,
        candidates: false
    },
    group: 'web',
    inputtingComment: {
        comment: '',
        evaluation: '',
    }
};

type Action =
    actions.AddComment
    | actions.RemoveComment
    | actions.SetCandidates
    | actions.SelectCandidate
    | actions.DeselectCandidate
    | actions.RemoveCandidate
    | actions.MoveCandidate
    | actions.SetGroup
    | actions.InupttingComment;

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
    }
}

export function candidates(
    state: Candidates = init,
    action: Action
): Candidates {
    const newState = { ...state };
    switch (action.type) {
        case asyncActions.COMMENT.START:
            newState.isLoading.comments = true;
            return newState;
        case asyncActions.COMMENT.SUCCESS:
        case asyncActions.COMMENT.FAILURE:
            newState.isLoading.comments = false;
            return newState;
        case actions.ADD_COMMENT:
            newState.candidates[action.step].get(action.cid)!.comments[action.commenter] = action.comment;
            newState.inputtingComment = {
                comment: '',
                evaluation: '',
            };
            sessionStorage.setItem('candidates', JSON.stringify(newState.candidates.map(i => mapToObj(i))));
            return newState;
        case actions.REMOVE_COMMENT:
            delete newState.candidates[action.step].get(action.cid)!.comments[action.commenter];
            sessionStorage.setItem('candidates', JSON.stringify(newState.candidates.map(i => mapToObj(i))));
            return newState;
        case asyncActions.CANDIDATE.START:
            newState.isLoading.candidates = true;
            return newState;
        case asyncActions.CANDIDATE.SUCCESS:
        case asyncActions.CANDIDATE.FAILURE:
            newState.isLoading.candidates = false;
            return newState;
        case actions.SET_CANDIDATES:
            const candidatesToMap = action.candidates.map(i => new Map(Object.entries(i)));
            return { ...state, candidates: candidatesToMap };
        case actions.SELECT_CANDIDATE:
            newState.selected = [...new Set(newState.selected.concat(action.cid))];
            return newState;
        case actions.DESELECT_CANDIDATE:
            newState.selected = newState.selected.filter((i: string) => !action.cid.includes(i));
            return newState;
        case actions.REMOVE_CANDIDATE:
            newState.candidates.map(step =>
                typeof action.cid === 'string'
                    ? step.delete(action.cid)
                    : action.cid.map(i => step.delete(i)));
            newState.selected = newState.selected.filter((i: string) => !action.cid.includes(i));
            sessionStorage.setItem('candidates', JSON.stringify(newState.candidates.map(i => mapToObj(i))));
            return newState;
        case actions.MOVE_CANDIDATE:
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
            sessionStorage.setItem('candidates', JSON.stringify(newState.candidates.map(i => mapToObj(i))));
            return newState;
        case actions.SET_GROUP:
            return { ...state, group: action.group };
        case actions.INPUTTING_COMMENT:
            return { ...state, inputtingComment: { evaluation: action.evaluation, comment: action.comment } }
    }
    return state;
}
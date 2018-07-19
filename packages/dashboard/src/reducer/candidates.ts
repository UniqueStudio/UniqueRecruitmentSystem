import * as actions from '../action';
import * as asyncActions from '../action/async';

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
    candidates: object[];
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
            newState.candidates[action.step][action.cid].comments[action.commenter] = action.comment;
            newState.inputtingComment = {
                comment: '',
                evaluation: '',
            };
            return newState;
        case actions.REMOVE_COMMENT:
            delete newState.candidates[action.step][action.cid].comments[action.commenter];
            return newState;
        case asyncActions.CANDIDATE.START:
            newState.isLoading.candidates = true;
            return newState;
        case asyncActions.CANDIDATE.SUCCESS:
        case asyncActions.CANDIDATE.FAILURE:
            newState.isLoading.candidates = false;
            return newState;
        case actions.SET_CANDIDATES:
            return { ...state, candidates: action.candidates };
        case actions.SELECT_CANDIDATE:
            newState.selected = [...new Set(newState.selected.concat(action.cid))];
            return newState;
        case actions.DESELECT_CANDIDATE:
            newState.selected = newState.selected.filter((i: string) => !action.cid.includes(i));
            return newState;
        case actions.REMOVE_CANDIDATE:
            console.log(newState.candidates);
            for (const step of newState.candidates) {
                typeof action.cid === 'string' ? delete step[action.cid] : action.cid.map(i => delete step[i]);
            }
            newState.selected = newState.selected.filter((i: string) => !action.cid.includes(i));
            return newState;
        case actions.MOVE_CANDIDATE:
            const info = { ...newState.candidates[action.from][action.cid] };
            delete newState.candidates[action.from][action.cid];
            if (!newState.candidates[action.to]) {
                newState.candidates[action.to] = {};
            }
            newState.candidates[action.to][action.cid] = info;
            return newState;
        case actions.SET_GROUP:
            return { ...state, group: action.group };
        case actions.INPUTTING_COMMENT:
            return { ...state, inputtingComment: { evaluation: action.evaluation, comment: action.comment } }
    }
    return state;
}
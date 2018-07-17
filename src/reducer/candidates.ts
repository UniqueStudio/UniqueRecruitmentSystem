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

export interface Candidates {
    candidates: object[];
    selected: string[];
    isLoading: {
        comments: boolean;
        candidates: boolean;
    };
    group: string;
}

export function candidates(
    state: Candidates = init,
    action: Action
): Candidates {
    const newState = { ...state };
    switch (action.type) {
        case actions.ADD_COMMENT:
            newState['candidates'][action.step][action.cid].comments[action.commenter] = action.comment;
            return newState;
        case actions.REMOVE_COMMENT:
            delete newState['candidates'][action.step][action.cid].comments[action.commenter];
            return newState;
        case asyncActions.CANDIDATE.START:
            return { ...state, isLoading: { ...state.isLoading, candidates: true } };
        case asyncActions.CANDIDATE.SUCCESS:
        case asyncActions.CANDIDATE.FAILURE:
            return { ...state, isLoading: { ...state.isLoading, candidates: false } };
        case actions.SET_CANDIDATES:
            return { ...state, candidates: action.candidates };
        case actions.SELECT_CANDIDATE:
            newState['selected'] = [...new Set(newState['selected'].concat(action.cid))];
            return newState;
        case actions.DESELECT_CANDIDATE:
            newState['selected'] = newState['selected'].filter((i: string) => !action.cid.includes(i));
            return newState;
        case actions.REMOVE_CANDIDATE:
            for (const step of newState.candidates) {
                typeof action.cid === 'string' ? delete step[action.cid] : action.cid.map(i => delete step[i]);
            }
            newState['selected'] = newState['selected'].filter((i: string) => !action.cid.includes(i));
            return newState;
        case actions.MOVE_CANDIDATE:
            const info = newState['candidates'][action.from][action.cid];
            delete newState['candidates'][action.from][action.cid];
            if (!newState.candidates[action.to]) {
                newState.candidates[action.to] = {};
            }
            newState['candidates'][action.to][action.cid] = info;
            return newState;
        case actions.SET_GROUP:
            return { ...state, group: action.group };
    }
    return state;
}
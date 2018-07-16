import * as actions from '../action';
import { StoreState } from './index';

const init = {
    candidates: [],
    selected: [],
    isLoading: false,
    group: 'web',
    loggedIn: false,
};

type Action =
    actions.AddComment
    | actions.RemoveComment
    | actions.SetCandidates
    | actions.SelectCandidate
    | actions.DeselectCandidate
    | actions.RemoveCandidate
    | actions.MoveCandidate
    | actions.ToggleLoading
    | actions.SetGroup
    | actions.Login;

export default function data(
    state: StoreState['data'] = init,
    action: Action
): StoreState['data'] {
    const newState = { ...state };
    switch (action.type) {
        case actions.ADD_COMMENT:
            newState['candidates'][action.step][action.cid].comments[action.commenter] = action.comment;
            return newState;
        case actions.REMOVE_COMMENT:
            delete newState['candidates'][action.step][action.cid].comments[action.commenter];
            return newState;
        case actions.SET_CANDIDATES:
            return { ...state, candidates: action.candidates, isLoading: false };
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
            return { ...newState, isLoading: false };
        case actions.MOVE_CANDIDATE:
            const info = newState['candidates'][action.from][action.cid];
            delete newState['candidates'][action.from][action.cid];
            if (!newState.candidates[action.to]) {
                newState.candidates[action.to] = {};
            }
            newState['candidates'][action.to][action.cid] = info;
            return newState;
        case actions.TOGGLE_LOADING:
            return { ...state, isLoading: !state['isLoading'] };
        case actions.SET_GROUP:
            return { ...state, group: action.group };
        case actions.LOGIN:
            return { ...state, loggedIn: true };
    }
    return state;
}
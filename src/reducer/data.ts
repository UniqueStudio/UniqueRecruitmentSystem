import * as actions from '../action';
import { StoreState } from './index';
import * as candidates from '../candidates.json';
import mergeKV from '../lib/mergeKV';
import { GROUP } from '../constants';

const selected = mergeKV(GROUP.map(i => i.toLowerCase()),
    [...new Array(8)].map(() => []));

const init = {
    candidates: candidates['web'],
    selected: selected['web'],
    isLoading: true,
    group: 'web',
    loggedIn: false,
};

type Action =
    actions.AddComment
    | actions.RemoveComment
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
            newState['candidates'][action.step][action.uid].comments[action.commenter] = action.comment;
            return newState;
        case actions.REMOVE_COMMENT:
            delete newState['candidates'][action.step][action.uid].comments[action.commenter];
            return newState;
        case actions.SELECT_CANDIDATE:
            newState['selected'] = [...new Set(newState['selected'].concat(action.uid))];
            return newState;
        case actions.DESELECT_CANDIDATE:
            newState['selected'] = newState['selected'].filter((i: string) => !action.uid.includes(i));
            return newState;
        case actions.REMOVE_CANDIDATE:
            const currentStep = newState['candidates'][action.step];
            typeof action.uid === 'string' ? delete currentStep[action.uid] : action.uid.map(i => delete currentStep[i]);
            newState['candidates'][action.step] = currentStep;
            return newState;
        case actions.MOVE_CANDIDATE:
            const info = newState['candidates'][action.from][action.uid];
            delete newState['candidates'][action.from][action.uid];
            if (!newState.candidates[action.to]) {newState.candidates[action.to] = {};}
            newState['candidates'][action.to][action.uid] = info;
            return newState;
        case actions.TOGGLE_LOADING:
            return { ...state, isLoading: !state['isLoading'] };
        case actions.SET_GROUP:
            return { ...state, group: action.group, candidates: candidates[action.group], selected: selected[action.group] };
        case actions.LOGIN:
            return { ...state, loggedIn: true };
    }
    return state;
}
import * as actions from '../action';
import { StoreState } from './index';
import * as candidates from '../candidates.json';

const init = {
    candidates,
    selected: [],
    isLoading: true,
};

type Action = actions.AddComment | actions.SelectCandidate | actions.DeselectCandidate | actions.RemoveCandidate | actions.ToggleLoading;

export default function data(
    state: StoreState['data'] = init,
    action: Action
): StoreState['data'] {
    const newState = { ...state };
    switch (action.type) {
        case actions.ADD_COMMENT:
            newState['candidates'][action.step][action.name].comments[action.commenter] =
                action.comment;
            return newState;
        case actions.SELECT_CANDIDATE:
            newState['selected'] = [...new Set(newState['selected'].concat(action.name))];
            return newState;
        case actions.DESELECT_CANDIDATE:
            newState['selected'] = newState['selected'].filter((i: string) => !action.name.includes(i));
            return newState;
        case actions.REMOVE_CANDIDATE:
            const currentStep = newState['candidates'][action.step];
            typeof action.name === 'string' ? delete currentStep[action.name] : action.name.map(i => delete currentStep[i]);
            newState['candidates'][action.step] = currentStep;
            return newState;
        case actions.TOGGLE_LOADING:
            return { ...state, isLoading: !state['isLoading'] }
    }
    return state;
}
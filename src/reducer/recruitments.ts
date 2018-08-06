import * as actions from '../action';
import * as asyncActions from '../action/async'
import { Recruitment } from '../lib/const';

const init = {
    recruitments: [],
    isLoading: false,
    status: '',
    shouldUpdateRecruitment: false
};

type Action =
    actions.SetRecruitments
    | actions.UpdateRecruitment
    | actions.SetShouldUpdateRecruitment;


export interface Recruitments {
    recruitments: Recruitment[];
    isLoading: boolean;
    status: string;
    shouldUpdateRecruitment: boolean;
}

export function recruitments(state: Recruitments = init, action: Action): Recruitments {
    switch (action.type) {
        case asyncActions.RECRUITMENT.START:
            return { ...state, isLoading: true, status: 'start' };
        case asyncActions.RECRUITMENT.FAILURE:
            return { ...state, isLoading: false, status: 'failure' };
        case asyncActions.RECRUITMENT.SUCCESS:
            return { ...state, isLoading: false, status: 'success' };
        case actions.SET_RECRUITMENTS:
            return { ...state, recruitments: action.recruitments, shouldUpdateRecruitment: false };
        case actions.SET_SHOULD_UPDATE_RECRUITMENT:
            return { ...state, shouldUpdateRecruitment: true };
    }
    return state;
}
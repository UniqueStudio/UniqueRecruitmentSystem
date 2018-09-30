import * as actions from '../action';
import { RECRUITMENT } from '../epic'
import { Recruitment } from '../lib/const';

const init = {
    recruitments: [],
    pending: '2018A',
    isLoading: false,
    status: '',
    shouldUpdateRecruitment: false
};

type Action =
    actions.GetRecruitmentsFulfilled
    // | actions.UpdateRecruitment
    | actions.SetShouldUpdateRecruitment;


export interface Recruitments {
    recruitments: Recruitment[];
    isLoading: boolean;
    pending: string;
    status: string;
    shouldUpdateRecruitment: boolean;
}

export function recruitments(state: Recruitments = init, action: Action): Recruitments {
    switch (action.type) {
        case RECRUITMENT.START:
            return { ...state, isLoading: true, status: 'start' };
        case RECRUITMENT.FAILURE:
            return { ...state, isLoading: false, status: 'failure' };
        case RECRUITMENT.SUCCESS:
            return { ...state, isLoading: false, status: 'success' };
        case actions.GET_RECRUITMENTS_FULFILLED:
            return { ...state, recruitments: action.recruitments, shouldUpdateRecruitment: false };
        case actions.SET_SHOULD_UPDATE_RECRUITMENT:
            return { ...state, shouldUpdateRecruitment: true };
    }
    return state;
}
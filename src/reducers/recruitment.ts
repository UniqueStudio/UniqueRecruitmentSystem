import * as actions from 'Actions';
import { RECRUITMENT } from 'Epics';

import { Recruitment } from 'Config/types';
import { updateStorage } from 'Utils/updateStorage';

type Action =
    | actions.GetRecruitmentsFulfilled
    | actions.SetViewingRecruitmentFulfilled
    // | actions.UpdateRecruitment
    | actions.SetShouldUpdateRecruitment;

export interface RecruitmentStore {
    recruitments: Recruitment[];
    isLoading: boolean;
    viewing: string;
    shouldUpdateRecruitment: boolean;
}

const init: RecruitmentStore = {
    recruitments: [],
    viewing: sessionStorage.getItem('viewing') || '',
    isLoading: false,
    shouldUpdateRecruitment: true,
};

export function recruitmentReducer(state = init, action: Action): RecruitmentStore {
    switch (action.type) {
        case RECRUITMENT.START:
            return { ...state, isLoading: true };
        case RECRUITMENT.FAILURE:
            return { ...state, isLoading: false };
        case RECRUITMENT.SUCCESS:
            return { ...state, isLoading: false };
        case actions.GET_RECRUITMENTS_FULFILLED:
            const { recruitments } = action;
            updateStorage('recruitments')(recruitments);
            return { ...state, recruitments, shouldUpdateRecruitment: false };
        case actions.SET_SHOULD_UPDATE_RECRUITMENT:
            return { ...state, shouldUpdateRecruitment: true };
        case actions.SET_VIEWING_RECRUITMENT_FULFILLED:
            updateStorage('viewing')(action.title);
            return { ...state, viewing: action.title };
    }
    return state;
}

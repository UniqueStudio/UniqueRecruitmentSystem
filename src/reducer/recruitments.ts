import * as actions from '../action';
import * as asyncActions from '../action/async'

const init = {
    recruitments: [],
    isLoading: false,
    status: ''
};

type Action =
    actions.SetRecruitments
    | actions.UpdateRecruitment;

export interface Data {
    group: "web" | "lab" | "ai" | "game" | "android" | "ios" | "design" | "pm";
    total: number;
    steps: number[];
}

export interface Recruitment {
    title: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    begin: number;
    end: number;
    total: number;
    data: Data[];
}

export interface Recruitments {
    recruitments: Recruitment[];
    isLoading: boolean;
    status: string;
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
            return { ...state, recruitments: action.recruitments };
    }
    return state;
}
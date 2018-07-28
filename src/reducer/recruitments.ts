import * as actions from '../action';
import * as asyncActions from '../action/async'

const init = {
    recruitments: [],
    isLoading: false,
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
}

export function recruitments(state: Recruitments = init, action: Action): Recruitments {
    switch (action.type) {
        case asyncActions.RECRUITMENT.START:
            return { ...state, isLoading: true };
        case asyncActions.RECRUITMENT.FAILURE:
        case asyncActions.RECRUITMENT.SUCCESS:
            return { ...state, isLoading: false };
        case actions.SET_RECRUITMENTS:
            return { ...state, recruitments: action.recruitments };
    }
    return state;
}
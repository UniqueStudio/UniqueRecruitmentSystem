import * as asyncActions from '../action/async';

const init = {
    isLoading: false,
    status: ''
};

export interface Sms {
    isLoading: boolean;
    status: string;
}

export function sms(
    state: Sms = init,
    action: { type: string }
): Sms {
    switch (action.type) {
        case asyncActions.SMS.START:
            return { ...state, isLoading: true, status: 'start' };
        case asyncActions.SMS.SUCCESS:
            return { ...state, isLoading: false, status: 'success' };
        case asyncActions.SMS.FAILURE:
            return { ...state, isLoading: false, status: 'failure' };

    }
    return state;
}
import { SMS } from '../epic';

const init = {
    isLoading: false,
    status: '',
};

export interface Sms {
    isLoading: boolean;
    status: string;
}

export function sms(
    state: Sms = init,
    action: { type: string },
): Sms {
    switch (action.type) {
        case SMS.START:
            return { ...state, isLoading: true, status: 'start' };
        case SMS.SUCCESS:
            return { ...state, isLoading: false, status: 'success' };
        case SMS.FAILURE:
            return { ...state, isLoading: false, status: 'failure' };
    }
    return state;
}

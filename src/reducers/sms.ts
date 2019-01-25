import { SMS } from 'Epics';

export interface SmsStore {
    isLoading: boolean;
    status: string;
}

const init = {
    isLoading: false,
    status: '',
};

export function smsReducer(state: SmsStore = init, action: { type: string }): SmsStore {
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

export interface SmsStore {
    status: string;
}

const init = {
    status: '',
};

export function smsReducer(state: SmsStore = init, action: { type: string }): SmsStore {
    switch (action.type) {
        // case SMS.START:
        //     return { ...state, status: 'start' };
        // case SMS.SUCCESS:
        //     return { ...state, status: 'success' };
        // case SMS.FAILURE:
        //     return { ...state, status: 'failure' };
    }
    return state;
}

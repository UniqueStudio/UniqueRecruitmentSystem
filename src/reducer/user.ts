import * as actions from '../action';

const init = {
    loggedIn: false,
};

type Action = actions.Login;

export interface User {
    loggedIn: boolean;
}

export function user(state: User = init, action: Action): User {
    switch (action.type) {
        case actions.LOGIN:
            return { ...state, loggedIn: true };
    }
    return state;
}
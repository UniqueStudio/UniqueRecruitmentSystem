import * as actions from '../action';
import * as asyncActions from '../action/async'

const init = {
    loggedIn: !!sessionStorage.getItem('username'),
    username: '',
    uid: '',
    isLoading: false,
    info: {}
};

type Action =
    actions.Login
    | actions.Logout
    | actions.ChangeUserInfo;

export interface User {
    loggedIn: boolean;
    username: string;
    uid: string;
    isLoading: boolean;
    info: object;
}

export function user(state: User = init, action: Action): User {
    switch (action.type) {
        case asyncActions.USER.START:
            return { ...state, isLoading: true };
        case asyncActions.USER.FAILURE:
        case asyncActions.USER.SUCCESS:
            return { ...state, isLoading: false };
        case actions.LOGIN:
            return { ...state, loggedIn: true, username: action.username, uid: action.uid };
        case actions.LOGOUT:
            return { ...state, loggedIn: false };
        case actions.CHANGE_USER_INFO: {
            return { ...state, info: action.info };
        }
    }
    return state;
}
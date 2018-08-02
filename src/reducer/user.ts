import * as actions from '../action';
import * as asyncActions from '../action/async'

const userInfo = sessionStorage.getItem('userInfo');

const init = {
    loggedIn: !!sessionStorage.getItem('uid'),
    username: userInfo ? JSON.parse(userInfo).username : '',
    uid: sessionStorage.getItem('uid') || '',
    isLoading: false,
    info: {},
    key: '',
    qRCodeGettable: true
};

type Action =
    actions.Login
    | actions.Logout
    | actions.ChangeUserInfo
    | actions.SetKey
    | actions.SetGettable;

export interface User {
    loggedIn: boolean;
    username: string;
    uid: string;
    isLoading: boolean;
    info: object;
    key: string;
    qRCodeGettable: boolean;
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
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('uid');
            sessionStorage.removeItem('userInfo');
            return { ...state, loggedIn: false };
        case actions.CHANGE_USER_INFO: {
            return { ...state, info: action.info, username: action.info['username'] || state.username };
        }
        case actions.SET_KEY: {
            return { ...state, key: action.key }
        }
        case actions.SET_GETTABLE: {
            return { ...state, qRCodeGettable: action.able }
        }
    }
    return state;
}
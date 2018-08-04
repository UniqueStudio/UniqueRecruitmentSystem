import * as actions from '../action';
import * as asyncActions from '../action/async'

const info = sessionStorage.getItem('userInfo');

const init = {
    loggedIn: !!sessionStorage.getItem('uid'),
    uid: sessionStorage.getItem('uid') || '',
    isLoading: false,
    info: info ? JSON.parse(info) : {},
    key: '',
    qRCodeGettable: true,
    messages: []
};

type Action =
    actions.Login
    | actions.Logout
    | actions.ChangeUserInfo
    | actions.SetKey
    | actions.SetGettable
    | actions.AddMessage
    | actions.AddImage;

export interface User {
    loggedIn: boolean;
    uid: string;
    isLoading: boolean;
    info: object;
    key: string;
    qRCodeGettable: boolean;
    messages: object[];
}

export function user(state: User = init, action: Action): User {
    switch (action.type) {
        case asyncActions.USER.START:
            return { ...state, isLoading: true };
        case asyncActions.USER.FAILURE:
        case asyncActions.USER.SUCCESS:
            return { ...state, isLoading: false };
        case actions.LOGIN:
            return { ...state, loggedIn: true, uid: action.uid };
        case actions.LOGOUT:
            sessionStorage.removeItem('uid');
            sessionStorage.removeItem('userInfo');
            return { ...state, loggedIn: false };
        case actions.CHANGE_USER_INFO:
            return { ...state, info: action.info };
        case actions.SET_KEY:
            return { ...state, key: action.key };
        case actions.SET_GETTABLE:
            return { ...state, qRCodeGettable: action.able };
        case actions.ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, {
                    avatar: action.avatar,
                    name: action.name,
                    message: action.message,
                    time: action.time,
                    isSelf: action.isSelf,
                    type: 'text'
                }]
            };
        case actions.ADD_IMAGE:
            return {
                ...state,
                messages: [...state.messages, {
                    avatar: action.avatar,
                    name: action.name,
                    message: action.image,
                    time: action.time,
                    isSelf: action.isSelf,
                    type: 'image'
                }]
            }
    }
    return state;
}
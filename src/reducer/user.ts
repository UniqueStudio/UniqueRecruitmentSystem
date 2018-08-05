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

const insert = (item: object, arr: object[]) => {
    const length = arr.length;
    if (length === 0) {
        return [item];
    }
    for (let i = length - 1; i >= 0; i--) {
        if (arr[i]['time'] > item['time']) {
            arr[i + 1] = arr[i]
        } else {
            arr[i + 1] = item;
            break;
        }
    }
    return arr;
};

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
                messages: insert({
                    avatar: action.avatar,
                    name: action.name,
                    message: action.message,
                    time: action.time,
                    isSelf: action.isSelf,
                    type: 'text'
                }, [...state.messages])
            };
        case actions.ADD_IMAGE:
            return {
                ...state,
                messages: insert({
                    avatar: action.avatar,
                    name: action.name,
                    message: action.image,
                    time: action.time,
                    isSelf: action.isSelf,
                    type: 'image'
                }, [...state.messages])
            }
    }
    return state;
}
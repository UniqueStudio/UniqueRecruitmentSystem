import * as actions from '../action';
import { USER } from '../epic'
import { User as UType } from '../lib/const';

const info = sessionStorage.getItem('userInfo');
const group = sessionStorage.getItem('groupInfo');

const init = {
    loggedIn: !!sessionStorage.getItem('uid'),
    uid: sessionStorage.getItem('uid') || '',
    isLoading: false,
    isScanning: false,
    info: info ? JSON.parse(info) : {},
    key: '',
    messages: [],
    group: group ? JSON.parse(group) : [],
    shouldUpdateGroup: false
};

type Action =
    actions.Login
    | actions.Logout
    | actions.SetQRCode
    | actions.SetUserInfo
    | actions.SetGroupInfo
    | actions.AddMessage
    | actions.AddImage;

export interface User {
    loggedIn: boolean;
    uid: string;
    isLoading: boolean;
    isScanning: boolean;
    info: UType;
    key: string;
    messages: object[];
    group: UType[];
    shouldUpdateGroup: boolean;
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
    return arr.slice(-75); // get 75 messages
};

export function user(state: User = init, action: Action): User {
    switch (action.type) {
        case USER.START:
            return { ...state, isLoading: true };
        case USER.FAILURE:
        case USER.SUCCESS:
            return { ...state, isLoading: false };
        case actions.SET_QR_CODE:
            return { ...state, key: action.key, isScanning: Boolean(action.key) };
        case actions.LOGIN:
            return { ...state, loggedIn: true, uid: action.uid };
        case actions.LOGOUT:
            sessionStorage.removeItem('uid');
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('token');
            return { ...state, loggedIn: false };
        case actions.SET_USER_INFO:
            return { ...state, info: action.info, shouldUpdateGroup: true };
        case actions.SET_GROUP_INFO:
            return { ...state, group: action.info, shouldUpdateGroup: false };
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
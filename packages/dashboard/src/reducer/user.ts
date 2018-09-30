import * as actions from '../action';
import { USER } from '../epic';

import { Message, User as UType } from '../lib/const';

const token = localStorage.getItem('token');
const payload = token && token.split('.')[1];
const time = payload && JSON.parse(atob(payload)).exp;
const info = localStorage.getItem('userInfo');
const group = sessionStorage.getItem('groupInfo');

const init = {
    loggedIn: !!info && time && time > +new Date() / 1000,
    uid: (info && JSON.parse(info)._id) || '',
    isLoading: false,
    isScanning: false,
    info: info ? JSON.parse(info) : {},
    key: '',
    messages: [],
    group: group ? JSON.parse(group) : [],
    shouldUpdateGroup: false,
};

type Action =
    actions.Login
    | actions.Logout
    | actions.GetQRCodeFulfilled
    | actions.UserInfoFulfilled
    | actions.GetGroupInfoFulfilled
    | actions.AddMessage
    | actions.AddImage;

export interface User {
    loggedIn: boolean;
    uid: string;
    isLoading: boolean;
    isScanning: boolean;
    info: UType;
    key: string;
    messages: Message[];
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
            arr[i + 1] = arr[i];
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
        case actions.GET_QR_CODE_FULFILLED:
            return { ...state, key: action.key, isScanning: Boolean(action.key) };
        case actions.LOGIN:
            return { ...state, loggedIn: true, uid: action.uid };
        case actions.LOGOUT:
            localStorage.removeItem('uid');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            return { ...state, loggedIn: false };
        case actions.USER_INFO_FULFILLED:
            return { ...state, info: action.info, shouldUpdateGroup: true };
        case actions.GET_GROUP_INFO_FULFILLED:
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
                    type: 'text',
                }, [...state.messages]) as Message[],
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
                    type: 'image',
                }, [...state.messages]) as Message[],
            };
    }
    return state;
}

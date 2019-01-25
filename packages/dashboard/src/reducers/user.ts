import * as actions from 'Actions';

import { Message, User } from 'Config/types';
import { USER } from 'Epics';

import { updateStorage } from 'Utils/updateStorage';

type Action =
    actions.Login
    | actions.Logout
    | actions.GetQRCodeFulfilled
    | actions.UserInfoFulfilled
    | actions.GetGroupInfoFulfilled
    | actions.AddMessage;

export interface UserStore {
    token: string;
    isLoading: boolean;
    isScanning: boolean;
    info: User;
    key: string;
    messages: Message[];
    groupInfo: User[];
    firstLoad: boolean;
}

const storedToken = localStorage.getItem('token');
const payload = storedToken && storedToken.split('.')[1];
const time = payload && JSON.parse(atob(payload)).exp;
const verifiedToken = storedToken !== null && (time > Date.now() / 1000) ? storedToken : '';

const init: UserStore = {
    token: verifiedToken,
    isLoading: false,
    isScanning: false,
    info: {} as User,
    key: '',
    messages: [],
    groupInfo: [],
    firstLoad: true,
};

const insert = (item: Message, arr: Message[]) => {
    const length = arr.length;
    if (length === 0) {
        return [item];
    }
    for (let i = length - 1; i >= 0; i--) {
        if (arr[i].time > item.time) {
            arr[i + 1] = arr[i];
        } else {
            arr[i + 1] = item;
            break;
        }
    }
    return arr.slice(-100); // get 100 messages TODO: can we get more?
};

export function userReducer(state = init, action: Action): UserStore {
    switch (action.type) {
        case USER.START:
            return { ...state, isLoading: true };
        case USER.FAILURE:
        case USER.SUCCESS:
            return { ...state, isLoading: false };
        case actions.GET_QR_CODE_FULFILLED:
            return { ...state, key: action.key, isScanning: Boolean(action.key) };
        case actions.LOGIN:
            const { token } = action;
            localStorage.setItem('token', token);
            return { ...state, token };
        case actions.LOGOUT:
            localStorage.removeItem('token');
            return { ...state, token: '' };
        case actions.USER_INFO_FULFILLED: {
            const info = { ...state.info, ...action.info };
            updateStorage('user')(info);
            return { ...state, info };
        }
        case actions.GET_GROUP_INFO_FULFILLED: {
            const info = action.info;
            updateStorage('group')(info);
            return { ...state, groupInfo: info, firstLoad: false };
        }
        case actions.ADD_MESSAGE:
            const messages = insert(action.message, [...state.messages]);
            return { ...state, messages };
    }
    return state;
}

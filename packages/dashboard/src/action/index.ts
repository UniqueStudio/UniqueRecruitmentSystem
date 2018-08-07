import { Recruitment, User } from '../lib/const';

export const TOGGLE_DRAWER_OPEN = 'TOGGLE_DRAWER_OPEN';
export type TOGGLE_DRAWER_OPEN = typeof TOGGLE_DRAWER_OPEN;

export interface ToggleDrawerOpen {
    type: TOGGLE_DRAWER_OPEN;
}

export function toggleDrawerOpen(): ToggleDrawerOpen {
    return {
        type: TOGGLE_DRAWER_OPEN
    }
}

export const TOGGLE_SNACKBAR_ON = 'TOGGLE_SNACKBAR_ON';
export type TOGGLE_SNACKBAR_ON = typeof TOGGLE_SNACKBAR_ON;

export interface ToggleSnackbarOn {
    type: TOGGLE_SNACKBAR_ON;
    color: string;
    info: string;
}

export function toggleSnackbarOn(info: string, color: string): ToggleSnackbarOn {
    return {
        type: TOGGLE_SNACKBAR_ON,
        color,
        info
    }
}

export const TOGGLE_SNACKBAR_OFF = 'TOGGLE_SNACKBAR_OFF';
export type TOGGLE_SNACKBAR_OFF = typeof TOGGLE_SNACKBAR_OFF;

export interface ToggleSnackbarOff {
    type: TOGGLE_SNACKBAR_OFF;
}

export function toggleSnackbarOff(): ToggleSnackbarOff {
    return {
        type: TOGGLE_SNACKBAR_OFF
    }
}

export type direction = 'left' | 'right' | 'up' | 'down';
export const TOGGLE_MODAL_ON = 'TOGGLE_MODAL_ON';
export type TOGGLE_MODAL_ON = typeof TOGGLE_MODAL_ON;

export interface ToggleModalOn {
    type: TOGGLE_MODAL_ON;
    cid: string;
}

export function toggleModalOn(cid: string): ToggleModalOn {
    return {
        type: TOGGLE_MODAL_ON,
        cid
    }
}

export const TOGGLE_MODAL_OFF = 'TOGGLE_MODAL_OFF';
export type TOGGLE_MODAL_OFF = typeof TOGGLE_MODAL_OFF;

export interface ToggleModalOff {
    type: TOGGLE_MODAL_OFF;
}

export function toggleModalOff(): ToggleModalOff {
    return {
        type: TOGGLE_MODAL_OFF,
    }
}

export const TOGGLE_FAB_ON = 'TOGGLE_FAB_ON';
export type TOGGLE_FAB_ON = typeof TOGGLE_FAB_ON;

export interface ToggleFabOn {
    type: TOGGLE_FAB_ON;
    step: number
}

export function toggleFabOn(step: number): ToggleFabOn {
    return {
        type: TOGGLE_FAB_ON,
        step
    }
}

export const TOGGLE_FAB_OFF = 'TOGGLE_FAB_OFF';
export type TOGGLE_FAB_OFF = typeof TOGGLE_FAB_OFF;

export interface ToggleFabOff {
    type: TOGGLE_FAB_OFF;
}

export function toggleFabOff(): ToggleFabOff {
    return {
        type: TOGGLE_FAB_OFF,
    }
}

export const INPUTTING_COMMENT = 'INPUTTING_COMMENT';
export type INPUTTING_COMMENT = typeof INPUTTING_COMMENT;

export interface InupttingComment {
    type: INPUTTING_COMMENT;
    comment: string;
    evaluation: string;
}

export function inputtingComment(comment: string, evaluation: string): InupttingComment {
    return {
        type: INPUTTING_COMMENT,
        comment,
        evaluation
    }
}


export const ADD_COMMENT = 'ADD_COMMENT';
export type ADD_COMMENT = typeof ADD_COMMENT;

export interface AddComment {
    type: ADD_COMMENT;
    step: number;
    cid: string;
    commenter: string;
    comment: object;
}

export function addComment(step: number, cid: string, commenter: string, comment: object): AddComment {
    return {
        type: ADD_COMMENT,
        step,
        cid,
        commenter,
        comment
    }
}

export const REMOVE_COMMENT = 'REMOVE_COMMENT';
export type REMOVE_COMMENT = typeof REMOVE_COMMENT;

export interface RemoveComment {
    type: REMOVE_COMMENT;
    step: number;
    cid: string;
    commenter: string;
}

export function removeComment(step: number, cid: string, commenter: string): RemoveComment {
    return {
        type: REMOVE_COMMENT,
        step,
        cid,
        commenter,
    }
}

export const SET_CANDIDATES = 'SET_CANDIDATES';
export type SET_CANDIDATES = typeof SET_CANDIDATES;

export interface SetCandidates {
    type: SET_CANDIDATES;
    candidates: object[];
}

export function setCandidates(candidates: object[]): SetCandidates {
    return {
        type: SET_CANDIDATES,
        candidates,
    }
}

export const ADD_CANDIDATE = 'ADD_CANDIDATE';
export type ADD_CANDIDATE = typeof ADD_CANDIDATE;

export interface AddCandidate {
    type: ADD_CANDIDATE;
    candidate: object;
}

export function addCandidate(candidate: object): AddCandidate {
    return {
        type: ADD_CANDIDATE,
        candidate,
    }
}


export const SELECT_CANDIDATE = 'SELECT_CANDIDATE';
export type SELECT_CANDIDATE = typeof SELECT_CANDIDATE;

export interface SelectCandidate {
    type: SELECT_CANDIDATE;
    cid: string | string[];
}

export function selectCandidate(cid: string | string[]): SelectCandidate {
    return {
        type: SELECT_CANDIDATE,
        cid,
    }
}

export const DESELECT_CANDIDATE = 'DESELECT_CANDIDATE';
export type DESELECT_CANDIDATE = typeof DESELECT_CANDIDATE;

export interface DeselectCandidate {
    type: DESELECT_CANDIDATE;
    cid: string | string[];
}

export function deselectCandidate(cid: string | Array<string>): DeselectCandidate {
    return {
        type: DESELECT_CANDIDATE,
        cid,
    }
}

export const REMOVE_CANDIDATE = 'REMOVE_CANDIDATE';
export type REMOVE_CANDIDATE = typeof REMOVE_CANDIDATE;

export interface RemoveCandidate {
    type: REMOVE_CANDIDATE;
    cid: string | string[];
}

export function removeCandidate(cid: string | string[]): RemoveCandidate {
    return {
        type: REMOVE_CANDIDATE,
        cid,
    }
}

export const MOVE_CANDIDATE = 'MOVE_CANDIDATE';
export type MOVE_CANDIDATE = typeof MOVE_CANDIDATE;

export interface MoveCandidate {
    type: MOVE_CANDIDATE;
    from: number;
    to: number;
    cid: string;
    position?: number;
}

export function moveCandidate(from: number, to: number, cid: string, position?: number): MoveCandidate {
    return {
        type: MOVE_CANDIDATE,
        from,
        to,
        cid,
        position,
    }
}

export const SET_SLOT = 'SET_SLOT';
export type SET_SLOT = typeof SET_SLOT;

export interface SetSlot {
    type: SET_SLOT;
    interview: 1 | 2;
    slot: object[]
}

export function setSlot(slot: object[], interview: 1 | 2): SetSlot {
    return {
        type: SET_SLOT,
        slot,
        interview
    }
}

export const SET_GROUP = 'SET_GROUP';
export type SET_GROUP = typeof SET_GROUP;

export interface SetGroup {
    type: SET_GROUP;
    group: string
}

export function setGroup(group: string): SetGroup {
    return {
        type: SET_GROUP,
        group
    }
}

export const SET_KEY = 'SET_KEY';
export type SET_KEY = typeof SET_KEY;

export interface SetKey {
    type: SET_KEY;
    key: string
}

export function setKey(key: string): SetKey {
    return {
        type: SET_KEY,
        key
    }
}

export const SET_GETTABLE = 'SET_GETTABLE';
export type SET_GETTABLE = typeof SET_GETTABLE;

export interface SetGettable {
    type: SET_GETTABLE;
    able: boolean
}

export function setGettable(able: boolean): SetGettable {
    return {
        type: SET_GETTABLE,
        able
    }
}


export const LOGIN = 'LOGIN';
export type LOGIN = typeof LOGIN;

export interface Login {
    type: LOGIN;
    uid: string;
}

export function login(uid: string): Login {
    return {
        type: LOGIN,
        uid
    }
}

export const LOGOUT = 'LOGOUT';
export type LOGOUT = typeof LOGOUT;

export interface Logout {
    type: LOGOUT;
}

export function logout(): Logout {
    return {
        type: LOGOUT
    }
}

export const CHANGE_USER_INFO = 'CHANGE_USER_INFO';
export type CHANGE_USER_INFO = typeof CHANGE_USER_INFO;

export interface ChangeUserInfo {
    type: CHANGE_USER_INFO;
    info: User;
}

export function changeUserInfo(info: ChangeUserInfo['info']): ChangeUserInfo {
    return {
        type: CHANGE_USER_INFO,
        info: { ...info, sex: info.sex || 'Male' }
    }
}

export const CHANGE_GROUP_INFO = 'CHANGE_GROUP_INFO';
export type CHANGE_GROUP_INFO = typeof CHANGE_GROUP_INFO;

export interface ChangeGroupInfo {
    type: CHANGE_GROUP_INFO;
    info: ChangeUserInfo['info'][]
}

export function changeGroupInfo(info: ChangeGroupInfo['info']): ChangeGroupInfo {
    return {
        type: CHANGE_GROUP_INFO,
        info
    }
}


export const SET_RECRUITMENTS = 'SET_RECRUITMENTS';
export type SET_RECRUITMENTS = typeof SET_RECRUITMENTS;

export interface SetRecruitments {
    type: SET_RECRUITMENTS;
    recruitments: Recruitment[];
}

export function setRecruitments(recruitments: Recruitment[]): SetRecruitments {
    return {
        type: SET_RECRUITMENTS,
        recruitments,
    }
}

export const UPDATE_RECRUITMENT = 'UPDATE_RECRUITMENT';
export type UPDATE_RECRUITMENT = typeof UPDATE_RECRUITMENT;

export interface UpdateRecruitment {
    type: UPDATE_RECRUITMENT;
    recruitment: Recruitment;
}

export function updateRecruitment(recruitment: Recruitment): UpdateRecruitment {
    return {
        type: UPDATE_RECRUITMENT,
        recruitment,
    }
}

export const SET_SHOULD_UPDATE_RECRUITMENT = 'SET_SHOULD_UPDATE_RECRUITMENT';
export type SET_SHOULD_UPDATE_RECRUITMENT = typeof SET_SHOULD_UPDATE_RECRUITMENT;

export interface SetShouldUpdateRecruitment {
    type: SET_SHOULD_UPDATE_RECRUITMENT;
}

export function setShouldUpdateRecruitment(): SetShouldUpdateRecruitment {
    return {
        type: SET_SHOULD_UPDATE_RECRUITMENT,
    }
}

export const ADD_MESSAGE = 'ADD_MESSAGE';
export type ADD_MESSAGE = typeof ADD_MESSAGE;

export interface AddMessage {
    type: ADD_MESSAGE;
    name: string;
    avatar: string;
    time: number;
    message: string;
    isSelf: boolean;
}

export function addMessage(name: string, avatar: string, time: number, message: string, isSelf: boolean): AddMessage {
    return {
        type: ADD_MESSAGE,
        name,
        avatar,
        time,
        message,
        isSelf
    }
}

export const ADD_IMAGE = 'ADD_IMAGE';
export type ADD_IMAGE = typeof ADD_IMAGE;

export interface AddImage {
    type: ADD_IMAGE;
    name: string;
    avatar: string;
    time: number;
    image: string;
    isSelf: boolean;
}

export function addImage(name: string, avatar: string, time: number, image: string, isSelf: boolean): AddImage {
    return {
        type: ADD_IMAGE,
        name,
        avatar,
        time,
        image,
        isSelf
    }
}
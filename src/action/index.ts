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

export const ADD_COMMENT = 'ADD_COMMENT';
export type ADD_COMMENT = typeof ADD_COMMENT;
export interface AddComment {
    type: ADD_COMMENT;
    step: string;
    uid: string;
    commenter: string;
    comment: object;
}
export function addComment(step: string, uid: string, commenter: string, comment: object): AddComment {
    return {
        type: ADD_COMMENT,
        step,
        uid,
        commenter,
        comment
    }
}

export const REMOVE_COMMENT = 'REMOVE_COMMENT';
export type REMOVE_COMMENT = typeof REMOVE_COMMENT;
export interface RemoveComment {
    type: REMOVE_COMMENT;
    step: string;
    uid: string;
    commenter: string;
}
export function removeComment(step: string, uid: string, commenter: string): RemoveComment {
    return {
        type: REMOVE_COMMENT,
        step,
        uid,
        commenter,
    }
}

export const SELECT_CANDIDATE = 'SELECT_CANDIDATE';
export type SELECT_CANDIDATE = typeof SELECT_CANDIDATE;
export interface SelectCandidate {
    type: SELECT_CANDIDATE;
    uid: string | string[];
}
export function selectCandidate(uid: string | Array<string>): SelectCandidate {
    return {
        type: SELECT_CANDIDATE,
        uid,
    }
}

export const DESELECT_CANDIDATE = 'DESELECT_CANDIDATE';
export type DESELECT_CANDIDATE = typeof DESELECT_CANDIDATE;
export interface DeselectCandidate {
    type: DESELECT_CANDIDATE;
    uid: string | string[];
}
export function deselectCandidate(uid: string | Array<string>): DeselectCandidate {
    return {
        type: DESELECT_CANDIDATE,
        uid,
    }
}

export const REMOVE_CANDIDATE = 'REMOVE_CANDIDATE';
export type REMOVE_CANDIDATE = typeof REMOVE_CANDIDATE;
export interface RemoveCandidate {
    type: REMOVE_CANDIDATE;
    uid: string | string[];
    step: string
}
export function removeCandidate(step: string, uid: string | string[]): RemoveCandidate {
    return {
        type: REMOVE_CANDIDATE,
        uid,
        step,
    }
}

export const MOVE_CANDIDATE = 'MOVE_CANDIDATE';
export type MOVE_CANDIDATE = typeof MOVE_CANDIDATE;
export interface MoveCandidate {
    type: MOVE_CANDIDATE;
    from: string;
    to: string;
    uid: string;
}
export function moveCandidate(from: string, to: string, uid: string): MoveCandidate {
    return {
        type: MOVE_CANDIDATE,
        from,
        to,
        uid
    }
}

export const TOGGLE_LOADING = 'TOGGLE_LOADING';
export type TOGGLE_LOADING = typeof TOGGLE_LOADING;
export interface ToggleLoading {
    type: TOGGLE_LOADING;
}
export function toggleLoading(): ToggleLoading {
    return {
        type: TOGGLE_LOADING,
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

export const LOGIN = 'LOGIN';
export type LOGIN = typeof LOGIN;
export interface Login {
    type: LOGIN;
    username: string;
}
export function login(username: string): Login {
    return {
        type: LOGIN,
        username
    }
}

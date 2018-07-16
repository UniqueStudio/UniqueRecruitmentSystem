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
}

export function moveCandidate(from: number, to: number, cid: string): MoveCandidate {
    return {
        type: MOVE_CANDIDATE,
        from,
        to,
        cid
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

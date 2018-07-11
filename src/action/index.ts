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
    name: string;
    commenter: string;
    comment: object;
}
export function addComment(step: string, name: string, commenter: string, comment: object): AddComment {
    return {
        type: ADD_COMMENT,
        step,
        name,
        commenter,
        comment
    }
}

export const SELECT_CANDIDATE = 'SELECT_CANDIDATE';
export type SELECT_CANDIDATE = typeof SELECT_CANDIDATE;
export interface SelectCandidate {
    type: SELECT_CANDIDATE;
    name: string | string[];
}
export function selectCandidate(name: string | Array<string>): SelectCandidate {
    return {
        type: SELECT_CANDIDATE,
        name,
    }
}

export const DESELECT_CANDIDATE = 'DESELECT_CANDIDATE';
export type DESELECT_CANDIDATE = typeof DESELECT_CANDIDATE;
export interface DeselectCandidate {
    type: DESELECT_CANDIDATE;
    name: string | string[];
}
export function deselectCandidate(name: string | Array<string>): DeselectCandidate {
    return {
        type: DESELECT_CANDIDATE,
        name,
    }
}

export const REMOVE_CANDIDATE = 'REMOVE_CANDIDATE';
export type REMOVE_CANDIDATE = typeof REMOVE_CANDIDATE;
export interface RemoveCandidate {
    type: REMOVE_CANDIDATE;
    name: string | string[];
    step: string
}
export function removeCandidate(step: string, name: string | string[]): RemoveCandidate {
    return {
        type: REMOVE_CANDIDATE,
        name,
        step,
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
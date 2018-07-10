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
    info?: string;
}
export function toggleSnackbarOn(info?: string): ToggleSnackbarOn {
    return {
        type: TOGGLE_SNACKBAR_ON,
        info
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
    name: string | Array<string>;
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
    name: string | Array<string>;
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
    name: string | Array<string>;
    step: string
}
export function removeCandidate(step: string, name: string | Array<string>): RemoveCandidate {
    return {
        type: REMOVE_CANDIDATE,
        name,
        step,
    }
}
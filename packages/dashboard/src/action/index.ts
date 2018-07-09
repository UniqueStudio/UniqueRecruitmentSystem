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

export type Action = ToggleDrawerOpen | AddComment;

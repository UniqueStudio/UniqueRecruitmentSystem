import { Dispatch } from 'redux';
import socketClient from 'socket.io-client';

import { store } from '../App';
import * as actions from './index';
import { URL } from '../lib/const';

const actionTypeCreator = (action: string) => ({
    START: `${action}_START`,
    SUCCESS: `${action}_SUCCESS`,
    FAILURE: `${action}_FAILURE`,
});

const resHandler = (res: any) => {
    if (res.ok) {
        return res.json();
    }
    throw new Error('Network is not OK');
};

export const USER = actionTypeCreator('USER');
export const login = (username: string) => (dispatch: Dispatch) => {
    dispatch({ type: USER.START });
    return fetch(`/user`, {
        method: 'POST',
        body: JSON.stringify({ username }),
        headers: { 'content-type': 'application/json' },
    })
        .then(resHandler)
        .then(res => {
            dispatch(actions.login(username, res.uid));
            dispatch({ type: USER.SUCCESS });
        })
        .catch(err => {
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'));
            dispatch({ type: USER.FAILURE });
        })
};

export const requestUser = (uid: string) => (dispatch: Dispatch) => {
    dispatch({ type: USER.START });
    return fetch(`/user/${uid}`)
        .then(resHandler)
        .then(res => {
            dispatch(actions.changeUserInfo(res));
            dispatch({ type: USER.SUCCESS });
        })
        .catch(err => {
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'));
            dispatch({ type: USER.FAILURE });
        })
};

export const updateUser = (uid: string, info: object) => (dispatch: Dispatch) => {
    dispatch({ type: USER.START });
    return fetch(`/user/${uid}`, {
        method: 'PUT',
        body: JSON.stringify({ uid, ...info }),
        headers: { 'content-type': 'application/json' },
    })
        .then(resHandler)
        .then(() => {
            dispatch(actions.changeUserInfo(info));
            dispatch({ type: USER.SUCCESS });
        })
        .catch(err => {
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'));
            dispatch({ type: USER.FAILURE });
        })
};

export const CANDIDATE = actionTypeCreator('CANDIDATE');
export const requestCandidate = (group: string) => (dispatch: Dispatch) => {
    dispatch({ type: CANDIDATE.START });
    dispatch(actions.setGroup(group));
    return fetch(`/candidates/${group}`)
        .then(resHandler)
        .then(res => {
            dispatch(actions.setCandidates(res));
            dispatch({ type: CANDIDATE.SUCCESS });
        })
        .catch(err => {
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'));
            dispatch({ type: CANDIDATE.FAILURE });
        })
};

export const removeCandidate = (cid: string) => (dispatch: Dispatch) => {
    dispatch({ type: CANDIDATE.START });
    return fetch(`$/candidates/${cid}`, { method: 'DELETE' })
        .then(resHandler)
        // .then(() => {
        //     dispatch({ type: CANDIDATE.SUCCESS });
        //     dispatch(actions.removeCandidate(cid));
        // })
        .catch(err => {
            dispatch({ type: CANDIDATE.FAILURE });
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'))
        });
};

export const moveCandidate = (from: number, to: number, cid: string) => (dispatch: Dispatch) => {
    dispatch({ type: CANDIDATE.START });
    return fetch(`/candidates/${cid}/step/${to}`, {
        method: 'PUT',
        body: JSON.stringify({ from }),
        headers: { 'content-type': 'application/json' },
    })
        .then(resHandler)
        // .then(() => {
        //     store.dispatch({ type: CANDIDATE.SUCCESS });
        //     store.dispatch(actions.moveCandidate(from, to, cid));
        // })
        .catch(err => {
            dispatch({ type: CANDIDATE.FAILURE });
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'))
        });
};

export const COMMENT = actionTypeCreator('COMMENT');
export const addComment = (step: number, cid: string, commenter: string, comment: object) => (dispatch: Dispatch) => {
    dispatch({ type: COMMENT.START });
    return fetch(`/candidates/${cid}/comments`, {
        method: 'POST',
        body: JSON.stringify({ uid: commenter, comment, step }),
        headers: { 'content-type': 'application/json' },
    })
        .then(resHandler)
        // .then(() => {
        //     dispatch({ type: COMMENT.SUCCESS });
        //     dispatch(actions.addComment(step, cid, commenter, comment));
        // })
        .catch(err => {
            dispatch({ type: COMMENT.FAILURE });
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'))
        });
};

export const removeComment = (step: number, cid: string, commenter: string) => (dispatch: Dispatch) => {
    dispatch({ type: COMMENT.START });
    return fetch(`/candidates/${cid}/comments/${commenter}`, {
        method: 'DELETE',
        body: JSON.stringify({ step }),
        headers: { 'content-type': 'application/json' },
    })
        .then(resHandler)
        // .then(() => {
        //     dispatch({ type: COMMENT.SUCCESS });
        //     dispatch(actions.removeComment(step, cid, commenter));
        // })
        .catch(err => {
            dispatch({ type: COMMENT.FAILURE });
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'))
        });
};

export const socket = socketClient(URL);
socket.on('removeCandidate', (cid: string) => {
    store.dispatch({ type: CANDIDATE.START });
    store.dispatch(actions.removeCandidate(cid));
    store.dispatch({ type: CANDIDATE.SUCCESS });
});
socket.on('moveCandidate', (cid: string, from: number, to: number) => {
    store.dispatch({ type: CANDIDATE.START });
    store.dispatch(actions.moveCandidate(from, to, cid));
    store.dispatch({ type: CANDIDATE.SUCCESS });
});
socket.on('addComment', (step: number, cid: string, commenter: string, comment: object) => {
    store.dispatch({ type: COMMENT.START });
    store.dispatch(actions.addComment(step, cid, commenter, comment));
    store.dispatch({ type: COMMENT.SUCCESS });
});
socket.on('removeComment', (step: number, cid: string, commenter: string) => {
    store.dispatch({ type: COMMENT.START });
    store.dispatch(actions.removeComment(step, cid, commenter));
    store.dispatch({ type: COMMENT.SUCCESS });
});
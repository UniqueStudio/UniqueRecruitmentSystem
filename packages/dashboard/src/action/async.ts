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

export const CANDIDATE = actionTypeCreator('CANDIDATE');
export const requestCandidate = (group: string) => (dispatch: Dispatch) => {
    dispatch({ type: CANDIDATE.START });
    dispatch(actions.setGroup(group));
    return fetch(`${URL}/candidates/${group}`)
        .then(resHandler)
        .then(res => {
            dispatch({ type: CANDIDATE.SUCCESS });
            dispatch(actions.setCandidates(res));
        })
        .catch(err => {
            dispatch({ type: CANDIDATE.FAILURE });
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'))
        })
};

export const removeCandidate = (cid: string) => (dispatch: Dispatch) => {
    dispatch({ type: CANDIDATE.START });
    return fetch(`${URL}/candidates/${cid}`, { method: 'DELETE' })
        .then(resHandler)
        .then(() => {
            dispatch({ type: CANDIDATE.SUCCESS });
            dispatch(actions.removeCandidate(cid));
        })
        .catch(err => {
            dispatch({ type: CANDIDATE.FAILURE });
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'))
        });
};

export const moveCandidate = (from: number, to: number, cid: string) => (dispatch: Dispatch) => {
    dispatch({ type: CANDIDATE.START });
    return fetch(`${URL}/candidates/${cid}`, {
        method: 'PUT',
        body: JSON.stringify({ from, to }),
        headers: { 'content-type': 'application/json' },
    })
        .then(resHandler)
        .then(() => {
            store.dispatch({ type: CANDIDATE.SUCCESS });
            store.dispatch(actions.moveCandidate(from, to, cid));
        })
        .catch(err => {
            dispatch({ type: CANDIDATE.FAILURE });
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'))
        });
};

export const COMMENT = actionTypeCreator('COMMENT');
export const addComment = (step: number, cid: string, commenter: string, comment: object) => (dispatch: Dispatch) => {
    dispatch({ type: COMMENT.START });
    return fetch(`${URL}/candidates/${cid}/comments`, {
        method: 'POST',
        body: JSON.stringify({ uid: commenter, comment }),
        headers: { 'content-type': 'application/json' },
    })
        .then(resHandler)
        .then(() => {
            dispatch({ type: COMMENT.SUCCESS });
            dispatch(actions.addComment(step, cid, commenter, comment));
        })
        .catch(err => {
            dispatch({ type: COMMENT.FAILURE });
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'))
        });
};

export const removeComment = (step: number, cid: string, commenter: string) => (dispatch: Dispatch) => {
    dispatch({ type: COMMENT.START });
    return fetch(`${URL}/candidates/${cid}/comments/${commenter}`, { method: 'DELETE' })
        .then(resHandler)
        .then(() => {
            dispatch({ type: COMMENT.SUCCESS });
            dispatch(actions.removeComment(step, cid, commenter));
        })
        .catch(err => {
            dispatch({ type: COMMENT.FAILURE });
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, 'danger'))
        });
};

export const socket = socketClient('http://localhost:5000');
socket.on('delete', (cid: string) => {
    store.dispatch({ type: CANDIDATE.SUCCESS });
    store.dispatch(actions.removeCandidate(cid))
});
socket.on('move', (cid: string, from: number, to: number) => {
    store.dispatch({ type: CANDIDATE.SUCCESS });
    store.dispatch(actions.moveCandidate(from, to, cid));
});

import { Dispatch } from 'redux';
import socketClient from 'socket.io-client';

import { store } from '../App';
import * as actions from './index';
import { URL } from '../lib/const';

export const socket = socketClient(URL);

const actionTypeCreator = (action: string) => ({
    START: `${action}_START`,
    SUCCESS: `${action}_SUCCESS`,
    FAILURE: `${action}_FAILURE`,
});

const resHandler = (res: any) => {
    try {
        return res.json();
    } catch (e) {
        throw new Error('Network is not OK');
    }
};

export const USER = actionTypeCreator('USER');
export const login = (username: string) => (dispatch: Dispatch) => {
    dispatch({ type: USER.START });
    return fetch(`${URL}/user`, {
        method: 'POST',
        body: JSON.stringify({ username }),
        headers: { 'content-type': 'application/json' },
    })
        .then(resHandler)
        .then(res => {
            if (res.type === 'success') {
                dispatch(actions.login(username, res.uid));
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('uid', res.uid);
                dispatch({ type: USER.SUCCESS });
            } else throw res;
        })
        .catch(err => {
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, err.type || 'danger'));
            dispatch({ type: USER.FAILURE });
        })
};

export const requestUser = (uid: string) => (dispatch: Dispatch) => {
    dispatch({ type: USER.START });
    const user = sessionStorage.getItem('userInfo');
    if (user) {
        dispatch(actions.changeUserInfo(JSON.parse(user)));
        dispatch({ type: USER.SUCCESS });
        return;
    }
    return !user && fetch(`${URL}/user/${uid}`)
        .then(resHandler)
        .then(res => {
            if (res.type === 'success') {
                sessionStorage.setItem('userInfo', JSON.stringify(res.data));
                dispatch(actions.changeUserInfo(res.data));
                dispatch({ type: USER.SUCCESS });
            } else throw res;
        })
        .catch(err => {
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, err.type || 'danger'));
            dispatch({ type: USER.FAILURE });
        })
};

export const updateUser = (uid: string, info: object) => (dispatch: Dispatch) => {
    dispatch({ type: USER.START });
    return fetch(`${URL}/user/${uid}`, {
        method: 'PUT',
        body: JSON.stringify({ uid, ...info }),
        headers: { 'content-type': 'application/json' },
    })
        .then(resHandler)
        .then(res => {
            if (res.type === 'success') {
                sessionStorage.setItem('userInfo', JSON.stringify(info));
                dispatch(actions.changeUserInfo(info));
                dispatch({ type: USER.SUCCESS });
            } else throw res;
        })
        .catch(err => {
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, err.type || 'danger'));
            dispatch({ type: USER.FAILURE });
        })
};

export const CANDIDATE = actionTypeCreator('CANDIDATE');
export const requestCandidate = (group: string) => (dispatch: Dispatch) => {
    dispatch({ type: CANDIDATE.START });
    const candidates = sessionStorage.getItem('candidates');
    const storedGroup = sessionStorage.getItem('group');
    if (candidates && storedGroup === group) {
        dispatch(actions.setCandidates(JSON.parse(candidates)));
        dispatch({ type: CANDIDATE.SUCCESS });
        return;
    }
    dispatch(actions.setGroup(group));
    sessionStorage.setItem('group', group);
    return fetch(`${URL}/candidates/${group}`)
        .then(resHandler)
        .then(res => {
            if (res.type === 'success') {
                sessionStorage.setItem('candidates', JSON.stringify(res.data));
                dispatch(actions.setCandidates(res.data));
                dispatch({ type: CANDIDATE.SUCCESS });
            } else throw res;
        })
        .catch(err => {
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, err.type || 'danger'));
            dispatch({ type: CANDIDATE.FAILURE });
        })
};

export const removeCandidate = (cid: string) => (dispatch: Dispatch) => {
    dispatch({ type: CANDIDATE.START });
    socket.emit('removeCandidate', cid);
    // return fetch(`${URL}/candidates/${cid}`, { method: 'DELETE' })
    //     .then(resHandler)
    //     .then(res => {
    //         if (res.type !== 'success') throw res;
    //     })
    //     // .then(() => {
    //     //     dispatch({ type: CANDIDATE.SUCCESS });
    //     //     dispatch(actions.removeCandidate(cid));
    //     // })
    //     .catch(err => {
    //         dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, err.type || 'danger'));
    //         dispatch({ type: CANDIDATE.FAILURE });
    //     });
};

export const moveCandidate = (from: number, to: number, cid: string, position?: number) => (dispatch: Dispatch) => {
    dispatch(actions.moveCandidate(from, to, cid, position));
    dispatch({ type: CANDIDATE.START });
    socket.emit('moveCandidate', cid, from, to);
    // return fetch(`${URL}/candidates/${cid}/step/${to}`, {
    //     method: 'PUT',
    //     body: JSON.stringify({ from }),
    //     headers: { 'content-type': 'application/json' },
    // })
    //     .then(resHandler)
    //     .then(res => {
    //         if (res.type !== 'success') throw res;
    //         store.dispatch({ type: COMMENT.SUCCESS });
    //     })
    //     // .then(() => {
    //     //     store.dispatch({ type: CANDIDATE.SUCCESS });
    //     //     store.dispatch(actions.moveCandidate(from, to, cid));
    //     // })
    //     .catch(err => {
    //         dispatch(actions.moveCandidate(to, from, cid));
    //         dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, err.type || 'danger'));
    //         dispatch({ type: CANDIDATE.FAILURE });
    //     });
};

export const COMMENT = actionTypeCreator('COMMENT');
export const addComment = (step: number, cid: string, commenter: string, comment: object) => (dispatch: Dispatch) => {
    dispatch({ type: COMMENT.START });
    socket.emit('addComment', step, cid, commenter, comment);
    // return fetch(`${URL}/candidates/${cid}/comments`, {
    //     method: 'POST',
    //     body: JSON.stringify({ uid: commenter, comment, step }),
    //     headers: { 'content-type': 'application/json' },
    // })
    //     .then(resHandler)
    //     .then(res => {
    //         if (res.type !== 'success') throw res;
    //     })
    //     // .then(() => {
    //     //     dispatch({ type: COMMENT.SUCCESS });
    //     //     dispatch(actions.addComment(step, cid, commenter, comment));
    //     // })
    //     .catch(err => {
    //         dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, err.type || 'danger'));
    //         dispatch({ type: COMMENT.FAILURE });
    //     });
};

export const removeComment = (step: number, cid: string, commenter: string) => (dispatch: Dispatch) => {
    dispatch({ type: COMMENT.START });
    socket.emit('removeComment', step, cid, commenter);
    // return fetch(`${URL}/candidates/${cid}/comments/${commenter}`, {
    //     method: 'DELETE',
    //     body: JSON.stringify({ step }),
    //     headers: { 'content-type': 'application/json' },
    // })
    //     .then(resHandler)
    //     .then(res => {
    //         if (res.type !== 'success') throw res;
    //     })
    //     // .then(() => {
    //     //     dispatch({ type: COMMENT.SUCCESS });
    //     //     dispatch(actions.removeComment(step, cid, commenter));
    //     // })
    //     .catch(err => {
    //         dispatch({ type: COMMENT.FAILURE });
    //         dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, err.type || 'danger'));
    //     });
};

export const RECRUITMENT = actionTypeCreator('RECRUITMENT');
export const requestRecruitments = () => (dispatch: Dispatch) => {
    dispatch({ type: RECRUITMENT.START });
    const recruitments = sessionStorage.getItem('historyRecruitments');
    if (recruitments) {
        dispatch(actions.setRecruitments(JSON.parse(recruitments)));
        dispatch({ type: RECRUITMENT.SUCCESS });
        return;
    }
    return fetch(`${URL}/recruitment`)
        .then(resHandler)
        .then(res => {
            if (res.type === 'success') {
                sessionStorage.setItem('historyRecruitments', JSON.stringify(res.data));
                dispatch(actions.setRecruitments(res.data));
                dispatch({ type: RECRUITMENT.SUCCESS });
            } else {
                throw res;
            }
        })
        .catch(err => {
            dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, err.type || 'danger'));
            dispatch({ type: RECRUITMENT.FAILURE });
        });
};

socket.on('removeCandidate', (cid: string) => {
    store.dispatch({ type: CANDIDATE.START });
    store.dispatch(actions.removeCandidate(cid));
    store.dispatch({ type: CANDIDATE.SUCCESS });
});
socket.on('removeCandidateError', (message: string, color: string) => {
    store.dispatch(actions.toggleSnackbarOn(`ERROR: ${message}`, color || 'danger'));
    store.dispatch({ type: CANDIDATE.FAILURE });
});

socket.on('moveCandidate', (cid: string, from: number, to: number) => {
    store.dispatch({ type: CANDIDATE.START });
    store.dispatch(actions.moveCandidate(from, to, cid));
    store.dispatch({ type: CANDIDATE.SUCCESS });
});
socket.on('moveCandidateSuccess', () => {
    store.dispatch({ type: CANDIDATE.SUCCESS });
});
socket.on('moveCandidateError', (message: string, color: string, data: { to: number, from: number, cid: string }) => {
    store.dispatch(actions.moveCandidate(data.to, data.from, data.cid));
    store.dispatch(actions.toggleSnackbarOn(`ERROR: ${message}`, color || 'danger'));
    store.dispatch({ type: CANDIDATE.FAILURE });
});

socket.on('addComment', (step: number, cid: string, commenter: string, comment: object) => {
    store.dispatch({ type: COMMENT.START });
    store.dispatch(actions.addComment(step, cid, commenter, comment));
    store.dispatch({ type: COMMENT.SUCCESS });
});
socket.on('addCommentError', (message: string, color: string) => {
    store.dispatch(actions.toggleSnackbarOn(`ERROR: ${message}`, color || 'danger'));
    store.dispatch({ type: COMMENT.FAILURE });
});

socket.on('removeComment', (step: number, cid: string, commenter: string) => {
    store.dispatch({ type: COMMENT.START });
    store.dispatch(actions.removeComment(step, cid, commenter));
    store.dispatch({ type: COMMENT.SUCCESS });
});
socket.on('removeCommentError', (message: string, color: string) => {
    store.dispatch(actions.toggleSnackbarOn(`ERROR: ${message}`, color || 'danger'));
    store.dispatch({ type: COMMENT.FAILURE });
});
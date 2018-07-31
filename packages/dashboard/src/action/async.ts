import { Dispatch } from 'redux';
import io from 'socket.io-client';

import { store } from '../App';
import * as actions from './index';
import { URL } from '../lib/const';

const socket = io(URL);

interface actionType {
    START: string;
    SUCCESS: string;
    FAILURE: string;
}

const actionTypeCreator = (action: string) => ({
    START: `${action}_START`,
    SUCCESS: `${action}_SUCCESS`,
    FAILURE: `${action}_FAILURE`,
});

const resHandler = (res: Response) => {
    try {
        return res.json();
    } catch (e) {
        throw new Error('Network is not OK');
    }
};

interface CustomError {
    message: string;
    type: string;
}

const errHandler = (err: CustomError, dispatch: Dispatch, type: actionType) => {
    dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, err.type || 'danger'));
    dispatch({ type: type.FAILURE });
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
                dispatch(actions.toggleSnackbarOn('已成功登录！', 'success'));
                sessionStorage.setItem('uid', res.uid);
                sessionStorage.setItem('token', res.token);
                dispatch({ type: USER.SUCCESS });
            } else throw res;
        })
        .catch(err => errHandler(err, dispatch, USER))
};

export const requestUser = (uid: string) => (dispatch: Dispatch) => {
    dispatch({ type: USER.START });
    const user = sessionStorage.getItem('userInfo');
    if (user && uid === sessionStorage.getItem('uid')) {
        dispatch(actions.changeUserInfo(JSON.parse(user)));
        dispatch({ type: USER.SUCCESS });
        return;
    }
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, USER);
        return;
    }
    return fetch(`${URL}/user/${uid}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(resHandler)
        .then(res => {
            if (res.type === 'success') {
                sessionStorage.setItem('userInfo', JSON.stringify(res.data));
                dispatch(actions.changeUserInfo(res.data));
                dispatch({ type: USER.SUCCESS });
            } else throw res;
        })
        .catch(err => errHandler(err, dispatch, USER))
};

export const updateUser = (uid: string, info: object) => (dispatch: Dispatch) => {
    dispatch({ type: USER.START });
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, USER);
        return;
    }
    return fetch(`${URL}/user/${uid}`, {
        method: 'PUT',
        body: JSON.stringify({ uid, ...info }),
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(resHandler)
        .then(res => {
            if (res.type === 'success') {
                sessionStorage.setItem('userInfo', JSON.stringify(info));
                dispatch(actions.toggleSnackbarOn('已成功修改信息！', 'success'));
                dispatch(actions.changeUserInfo(info));
                dispatch({ type: USER.SUCCESS });
            } else throw res;
        })
        .catch(err => errHandler(err, dispatch, USER))
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
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, CANDIDATE);
        return;
    }
    dispatch(actions.setGroup(group));
    sessionStorage.setItem('group', group);
    return fetch(`${URL}/candidates/${group}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
        .then(resHandler)
        .then(res => {
            if (res.type === 'success') {
                sessionStorage.setItem('candidates', JSON.stringify(res.data));
                dispatch(actions.setCandidates(res.data));
                dispatch({ type: CANDIDATE.SUCCESS });
            } else throw res;
        })
        .catch(err => errHandler(err, dispatch, CANDIDATE))
};

export const requestResume = (cid: string) => (dispatch: Dispatch) => {
    dispatch({ type: CANDIDATE.START });
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, CANDIDATE);
        return;
    }
    (async () => {
        try {
            const res = await fetch(`${URL}/candidates/${cid}/resume`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!res.ok) {
                const err = await res.json();
                errHandler(err, dispatch, CANDIDATE);
                return;
            }
            let filename = 'resume';
            const blob = await res.blob();
            const disposition = res.headers.get('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                    filename = Buffer.from(filename, 'base64').toString()
                }
            }
            const url = window.URL.createObjectURL(new Blob([blob]));

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            dispatch({ type: CANDIDATE.SUCCESS });
        } catch (err) {
            errHandler(err, dispatch, CANDIDATE)
        }
    })()
};

export const removeCandidate = (cid: string) => (dispatch: Dispatch) => {
    dispatch({ type: CANDIDATE.START });
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, CANDIDATE);
        return;
    }
    socket.emit('removeCandidate', cid, token);
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
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, CANDIDATE);
        return;
    }
    dispatch(actions.moveCandidate(from, to, cid, position));
    dispatch({ type: CANDIDATE.START });
    socket.emit('moveCandidate', cid, from, to, token);
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
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, COMMENT);
        return;
    }
    socket.emit('addComment', step, cid, commenter, comment, token);
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
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, COMMENT);
        return;
    }
    socket.emit('removeComment', step, cid, commenter, token);
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

export const sendSMS = (content: object) => (dispatch: Dispatch) => {
    dispatch({ type: CANDIDATE.START });
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, CANDIDATE);
        return;
    }
    return fetch(`${URL}/sms`, {
        method: 'POST',
        body: JSON.stringify(content),
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(resHandler)
        .then(res => {
            if (res.type === 'success') {
                dispatch(actions.toggleSnackbarOn('已成功发送短信', 'success'));
                dispatch({ type: CANDIDATE.SUCCESS });
            } else {
                throw res;
            }
        })
        .catch(err => errHandler(err, dispatch, CANDIDATE))
};

let shouldUpdateRecruitment = false;
export const RECRUITMENT = actionTypeCreator('RECRUITMENT');
export const requestRecruitments = () => (dispatch: Dispatch) => {
    dispatch({ type: RECRUITMENT.START });
    const recruitments = sessionStorage.getItem('historyRecruitments');
    if (recruitments && !shouldUpdateRecruitment) {
        dispatch(actions.setRecruitments(JSON.parse(recruitments)));
        dispatch({ type: RECRUITMENT.SUCCESS });
        return;
    }
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, RECRUITMENT);
        return;
    }
    shouldUpdateRecruitment = false;
    return fetch(`${URL}/recruitment`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
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
        .catch(err => errHandler(err, dispatch, RECRUITMENT))

};

export const launchRecruitment = (info: object) => (dispatch: Dispatch) => {
    dispatch({ type: RECRUITMENT.START });
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, RECRUITMENT);
        return;
    }
    return fetch(`${URL}/recruitment`, {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(resHandler)
        .then(res => {
            if (res.type === 'success') {
                dispatch(actions.toggleSnackbarOn('已成功发起招新！', 'success'));
                dispatch({ type: RECRUITMENT.SUCCESS });
            } else {
                throw res;
            }
        })
        .catch(err => errHandler(err, dispatch, RECRUITMENT))

};

socket.on('removeCandidate', (cid: string) => {
    store.dispatch({ type: CANDIDATE.START });
    store.dispatch(actions.removeCandidate(cid));
    store.dispatch(actions.toggleSnackbarOn('有候选人被移除了！', 'info'));
    store.dispatch({ type: CANDIDATE.SUCCESS });
});
socket.on('removeCandidateError', (message: string, color: string) => {
    store.dispatch(actions.toggleSnackbarOn(`ERROR: ${message}`, color || 'danger'));
    store.dispatch({ type: CANDIDATE.FAILURE });
});

socket.on('moveCandidate', (cid: string, from: number, to: number) => {
    store.dispatch({ type: CANDIDATE.START });
    store.dispatch(actions.moveCandidate(from, to, cid));
    store.dispatch(actions.toggleSnackbarOn('有候选人被移动了！', 'info'));
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
socket.on('addCandidate', (candidate: object) => {
    store.dispatch({ type: CANDIDATE.START });
    store.dispatch(actions.addCandidate(candidate));
    store.dispatch(actions.toggleSnackbarOn(`${candidate['group']}组多了一名报名选手！`, 'info'));
    store.dispatch({ type: CANDIDATE.SUCCESS });
});
socket.on('updateRecruitment', () => {
    shouldUpdateRecruitment = true;
});
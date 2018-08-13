import { Dispatch } from 'redux';
import io from 'socket.io-client';

import { store } from '../App';
import * as actions from './index';
import { Comment, URL } from '../lib/const';

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

// export const getQRCode = () => (dispatch: Dispatch) => {
//     dispatch({ type: USER.START });
//     dispatch(actions.setGettable(false));
//     (async () => {
//         try {
//             const initResponse = await fetch(`${URL}/user`);
//             const initResult = await resHandler(initResponse);
//             if (initResult.type === 'success') {
//                 const { key } = initResult;
//                 dispatch(actions.setKey(key));
//                 dispatch(actions.toggleSnackbarOn('请尽快用企业微信扫描二维码！', 'info'));
//                 dispatch({ type: USER.SUCCESS });
//                 const loginResponse = await fetch(`${URL}/user/${key}/status`);
//                 const loginResult = await resHandler(loginResponse);
//                 if (loginResult.type === 'success') {
//                     const { uid, token } = loginResult;
//                     dispatch(actions.login(uid));
//                     dispatch(actions.toggleSnackbarOn('已成功登录！', 'success'));
//                     sessionStorage.setItem('uid', uid);
//                     sessionStorage.setItem('token', token);
//                     dispatch({ type: USER.SUCCESS });
//                     requestUser(uid)(dispatch);
//                 } else {
//                     dispatch(actions.setKey(''));
//                     dispatch(actions.setGettable(true));
//                     errHandler(loginResult, dispatch, USER);
//                     return;
//                 }
//             } else {
//                 dispatch(actions.setKey(''));
//                 dispatch(actions.setGettable(true));
//                 errHandler(initResult, dispatch, USER);
//                 return;
//             }
//         } catch (err) {
//             dispatch(actions.setKey(''));
//             dispatch(actions.setGettable(true));
//             errHandler(err, dispatch, USER);
//         }
//     })();
// };

// export const login = (username: string) => (dispatch: Dispatch) => {
//     dispatch({ type: USER.START });
//     return fetch(`${URL}/user`, {
//         method: 'POST',
//         body: JSON.stringify({ username }),
//         headers: { 'content-type': 'application/json' },
//     })
//         .then(resHandler)
//         .then(res => {
//             if (res.type === 'success') {
//                 dispatch(actions.login(username, res.uid));
//                 dispatch(actions.toggleSnackbarOn('已成功登录！', 'success'));
//                 sessionStorage.setItem('uid', res.uid);
//                 sessionStorage.setItem('token', res.token);
//                 dispatch({ type: USER.SUCCESS });
//             } else throw res;
//         })
//         .catch(err => errHandler(err, dispatch, USER))
// };

// export const requestUser = (uid: string) => (dispatch: Dispatch) => {
//     dispatch({ type: USER.START });
//     const user = sessionStorage.getItem('userInfo');
//     if (user && uid === sessionStorage.getItem('uid')) {
//         dispatch(actions.setUserInfo(JSON.parse(user)));
//         dispatch({ type: USER.SUCCESS });
//         return;
//     }
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//         errHandler({ message: 'token不存在', type: 'danger' }, dispatch, USER);
//         return;
//     }
//     return fetch(`${URL}/user/${uid}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//         .then(resHandler)
//         .then(res => {
//             if (res.type === 'success') {
//                 sessionStorage.setItem('userInfo', JSON.stringify(res.data));
//                 dispatch(actions.setUserInfo(res.data));
//                 dispatch({ type: USER.SUCCESS });
//             } else throw res;
//         })
//         .catch(err => errHandler(err, dispatch, USER))
// };

// export const requestGroup = (group: string) => (dispatch: Dispatch) => {
//     dispatch({ type: USER.START });
//     const groupInfo = sessionStorage.getItem('groupInfo');
//     if (groupInfo && !store.getState().user.shouldUpdateGroup) {
//         dispatch(actions.setGroupInfo(JSON.parse(groupInfo)));
//         dispatch({ type: USER.SUCCESS });
//         return;
//     }
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//         errHandler({ message: 'token不存在', type: 'danger' }, dispatch, USER);
//         return;
//     }
//     if (!group) {
//         errHandler({ message: '请先完善个人信息！', type: 'warning' }, dispatch, CANDIDATE);
//         return;
//     }
//     return fetch(`${URL}/user/group/${group}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//         .then(resHandler)
//         .then(res => {
//             if (res.type === 'success') {
//                 sessionStorage.setItem('groupInfo', JSON.stringify(res.data));
//                 dispatch(actions.setGroupInfo(res.data));
//                 dispatch({ type: USER.SUCCESS });
//             } else throw res;
//         })
//         .catch(err => errHandler(err, dispatch, USER))
// };


// export const updateUser = (uid: string, info: User) => (dispatch: Dispatch) => {
//     dispatch({ type: USER.START });
//     const token = sessionStorage.getItem('token');
//     const formerInfo = sessionStorage.getItem('userInfo') || '{}';
//     if (!token) {
//         errHandler({ message: 'token不存在', type: 'danger' }, dispatch, USER);
//         return;
//     }
//     return fetch(`${URL}/user/${uid}`, {
//         method: 'PUT',
//         body: JSON.stringify({ uid, ...info }),
//         headers: {
//             'content-type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//     })
//         .then(resHandler)
//         .then(res => {
//             if (res.type === 'success') {
//                 sessionStorage.setItem('userInfo', JSON.stringify({ ...JSON.parse(formerInfo), ...info }));
//                 dispatch(actions.toggleSnackbarOn('已成功修改信息！', 'success'));
//                 dispatch(actions.setUserInfo(info));
//                 dispatch({ type: USER.SUCCESS });
//             } else throw res;
//         })
//         .catch(err => errHandler(err, dispatch, USER))
// };

export const CANDIDATE = actionTypeCreator('CANDIDATE');
// export const requestCandidate = (group: string) => (dispatch: Dispatch) => {
//     dispatch({ type: CANDIDATE.START });
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//         errHandler({ message: 'token不存在', type: 'danger' }, dispatch, CANDIDATE);
//         return;
//     }
//     if (!group) {
//         errHandler({ message: '请先完善个人信息！', type: 'warning' }, dispatch, CANDIDATE);
//         return;
//     }
//     dispatch(actions.setGroup(group));
//     const candidates = sessionStorage.getItem(group);
//     if (candidates && !store.getState().candidates.shouldUpdateCandidates) {
//         dispatch(actions.setCandidates(JSON.parse(candidates)));
//         dispatch({ type: CANDIDATE.SUCCESS });
//         return;
//     }
//     return fetch(`${URL}/candidates/group/${group}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         },
//     })
//         .then(resHandler)
//         .then(res => {
//             if (res.type === 'success') {
//                 sessionStorage.setItem(group, JSON.stringify(res.data));
//                 dispatch(actions.setCandidates(res.data));
//                 dispatch({ type: CANDIDATE.SUCCESS });
//             } else throw res;
//         })
//         .catch(err => errHandler(err, dispatch, CANDIDATE))
// };

// export const requestStepCandidate = (step: number) => (dispatch: Dispatch) => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//         errHandler({ message: 'token不存在', type: 'danger' }, dispatch, CANDIDATE);
//         return;
//     }
//     dispatch({ type: CANDIDATE.START });
//     return fetch(`${URL}/candidates/step/${step}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         },
//     })
//         .then(resHandler)
//         .then(res => {
//             if (res.type === 'success') {
//                 //dispatch(actions.setCandidates(res.data));
//                 dispatch({ type: CANDIDATE.SUCCESS });
//             } else throw res;
//         })
//         .catch(err => errHandler(err, dispatch, CANDIDATE))
// };


// export const requestResume = (cid: string) => (dispatch: Dispatch) => {
//     dispatch({ type: CANDIDATE.START });
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//         errHandler({ message: 'token不存在', type: 'danger' }, dispatch, CANDIDATE);
//         return;
//     }
//     (async () => {
//         try {
//             const res = await fetch(`${URL}/candidates/${cid}/resume`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//             });
//             if (!res.ok) {
//                 const err = await res.json();
//                 errHandler(err, dispatch, CANDIDATE);
//                 return;
//             }
//             let filename = 'resume';
//             const blob = await res.blob();
//             const disposition = res.headers.get('Content-Disposition');
//             if (disposition && disposition.indexOf('attachment') !== -1) {
//                 const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
//                 const matches = filenameRegex.exec(disposition);
//                 if (matches != null && matches[1]) {
//                     filename = matches[1].replace(/['"]/g, '');
//                     filename = Buffer.from(filename, 'base64').toString()
//                 }
//             }
//             const url = window.URL.createObjectURL(new Blob([blob]));
//
//             const a = document.createElement("a");
//             a.href = url;
//             a.download = filename;
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//             dispatch({ type: CANDIDATE.SUCCESS });
//         } catch (err) {
//             errHandler(err, dispatch, CANDIDATE)
//         }
//     })()
// };

// export const removeCandidate = (cid: string) => (dispatch: Dispatch) => {
//     dispatch({ type: CANDIDATE.START });
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//         errHandler({ message: 'token不存在', type: 'danger' }, dispatch, CANDIDATE);
//         return;
//     }
//     socket.emit('removeCandidate', cid, token);
//     // return fetch(`${URL}/candidates/${cid}`, { method: 'DELETE' })
//     //     .then(resHandler)
//     //     .then(res => {
//     //         if (res.type !== 'success') throw res;
//     //     })
//     //     // .then(() => {
//     //     //     dispatch({ type: CANDIDATE.SUCCESS });
//     //     //     dispatch(actions.removeCandidate(cid));
//     //     // })
//     //     .catch(err => {
//     //         dispatch(actions.toggleSnackbarOn(`ERROR: ${err.message}`, err.type || 'danger'));
//     //         dispatch({ type: CANDIDATE.FAILURE });
//     //     });
// };

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


export const RECRUITMENT = actionTypeCreator('RECRUITMENT');
export const requestRecruitments = () => (dispatch: Dispatch) => {
    dispatch({ type: RECRUITMENT.START });
    const recruitments = sessionStorage.getItem('historyRecruitments');
    if (recruitments && !store.getState().recruitments.shouldUpdateRecruitment) {
        dispatch(actions.setRecruitments(JSON.parse(recruitments)));
        dispatch({ type: RECRUITMENT.SUCCESS });
        return;
    }
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, RECRUITMENT);
        return;
    }
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
                dispatch(actions.setShouldUpdateRecruitment());
                dispatch(actions.toggleSnackbarOn('已成功发起招新！', 'success'));
                dispatch({ type: RECRUITMENT.SUCCESS });
            } else {
                throw res;
            }
        })
        .catch(err => errHandler(err, dispatch, RECRUITMENT))
};

export const SMS = actionTypeCreator('SMS');
export const sendSMS = (content: object) => (dispatch: Dispatch) => {
    dispatch({ type: SMS.START });
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, SMS);
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
                dispatch({ type: SMS.SUCCESS });
            } else {
                throw res;
            }
        })
        .catch(err => errHandler(err, dispatch, SMS))
};

export const sendInterview = (content: object) => (dispatch: Dispatch) => {
    dispatch({ type: SMS.START });
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, SMS);
        return;
    }
    return fetch(`${URL}/sms/interview`, {
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
                dispatch({ type: SMS.SUCCESS });
            } else {
                throw res;
            }
        })
        .catch(err => errHandler(err, dispatch, SMS))
};

export const getVerifyCode = () => (dispatch: Dispatch) => {
    dispatch({ type: SMS.START });
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, SMS);
        return;
    }
    return fetch(`${URL}/verification/user`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
        .then(resHandler)
        .then(res => {
            if (res.type === 'success') {
                dispatch(actions.toggleSnackbarOn('验证码已发送！', 'success'));
                dispatch({ type: SMS.SUCCESS });
            } else {
                throw res;
            }
        })
        .catch(err => errHandler(err, dispatch, SMS))
};

export const submitSlots = (title: string, slots: number[], group: string) => (dispatch: Dispatch) => {
    dispatch({ type: CANDIDATE.START });
    const token = sessionStorage.getItem('token');
    if (!token) {
        errHandler({ message: 'token不存在', type: 'danger' }, dispatch, SMS);
        return;
    }
    return fetch(`${URL}/recruitment/slots`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            slots,
            group
        }),
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then(resHandler)
        .then(res => {
            if (res.type === 'success') {
                dispatch(actions.setSlot(res.result, res.interview));
                if (res.failed === 0) {
                    dispatch(actions.toggleSnackbarOn('所有候选人均分配了时间！', 'success'));
                } else {
                    dispatch(actions.toggleSnackbarOn(`有${res.failed}位候选人没有分配到时间！`, 'info'));
                }
                dispatch({ type: CANDIDATE.SUCCESS });
            } else {
                throw res;
            }
        })
        .catch(err => errHandler(err, dispatch, CANDIDATE))
};

export const sendMessage = (message: string) => (dispatch: Dispatch) => {
    const state = store.getState();
    const name = state.user.info.username;
    const avatar = state.user.info.avatar;
    const time = +new Date();
    dispatch(actions.addMessage(name, avatar, time, message, true));
    socket.emit('sendMessage', name, avatar, time, message, false);
};

export const sendImage = (image: string) => (dispatch: Dispatch) => {
    const state = store.getState();
    const name = state.user.info.username;
    const avatar = state.user.info.avatar;
    const time = +new Date();
    dispatch(actions.addImage(name, avatar, time, image, true));
    socket.emit('sendMessage', name, avatar, time, image, true);
};

socket.on('removeCandidate', (cid: string) => {
    store.dispatch({ type: CANDIDATE.START });
    store.dispatch(actions.removeCandidateFulFilled(cid));
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

socket.on('addComment', (step: number, cid: string, commenter: string, comment: Comment) => {
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
    store.dispatch({ type: RECRUITMENT.START });
    store.dispatch(actions.setShouldUpdateRecruitment());
    store.dispatch({ type: RECRUITMENT.SUCCESS });
});

socket.on('receiveMessage', (name: string, avatar: string, time: number, message: string) => {
    store.dispatch({ type: USER.START });
    store.dispatch(actions.addMessage(name, avatar, time, message, false));
    store.dispatch({ type: USER.SUCCESS });
});

socket.on('receiveImage', (name: string, avatar: string, time: number, image: string) => {
    store.dispatch({ type: USER.START });
    store.dispatch(actions.addImage(name, avatar, time, image, false));
    store.dispatch({ type: USER.SUCCESS });
});
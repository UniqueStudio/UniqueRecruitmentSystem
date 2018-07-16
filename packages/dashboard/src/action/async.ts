import { Dispatch } from 'redux';
// import socketClient from 'socket.io-client';
import * as actions from './index';
import { URL } from '../lib/const';

export const requestCandidate = (group: string) => (dispatch: Dispatch) => {
    dispatch(actions.toggleLoading());
    dispatch(actions.setGroup(group));
    return fetch(`${URL}/candidates/${group}`)
        .then(res => res.json())
        .catch(err => console.log(err))
        .then(res => {
            dispatch(actions.setCandidates(res));
        })
};

export const removeCandidate = (cid: string) => (dispatch: Dispatch) => {
    dispatch(actions.toggleLoading());
    return fetch(`${URL}/candidates/${cid}`, { method: 'DELETE' })
        .then(() => dispatch(actions.removeCandidate(cid)));
};

// const socket = socketClient('http://localhost:5000');
// socket.on('info', (data: string) => console.log(data));

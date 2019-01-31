import { combineEpics, createEpicMiddleware, EpicMiddleware } from 'redux-observable';
import { BehaviorSubject, of } from 'rxjs';

import io from 'socket.io-client';

import { VariantType } from 'notistack';

import { enqueueSnackbar, toggleProgress } from 'Actions';
import { StoreState } from 'Reducers';
import { store } from '../App';

import candidateEpic from './candidate';
import chatEpic from './chat';
import recruitmentEpic from './recruitment';
import smsEpic from './sms';
import userEpic from './user';
import websocketEpic from './websocket';

export type Socket = typeof io.Socket;

export interface Action {
    type: string;
}

interface CustomError extends Error {
    message: string;
    type?: VariantType;
}

export const customError = (error: object) => {
    const err = new Error(error['message']);
    err['type'] = error['type'];
    return err as CustomError;
};

export const errHandler = (err: CustomError, customAction?: Action) => customAction ? of(
    enqueueSnackbar(`ERROR: ${err.message}`, { variant: err.type || 'error' }),
    toggleProgress(),
    customAction
) : of(
    enqueueSnackbar(`ERROR: ${err.message}`, { variant: err.type || 'error' }),
    toggleProgress(),
);

export const checkToken = () => {
    const token = store.getState().user.token;
    if (!token) {
        throw customError({ message: 'token不存在' });
    }
    return token;
};

const dependencies = { io, socket$: new BehaviorSubject(null as unknown as Socket), sessionStorage };

export type Dependencies = typeof dependencies;

export const epicMiddleware: EpicMiddleware<Action, Action, StoreState> = createEpicMiddleware({
    dependencies,
});

export const epics = combineEpics(
    ...userEpic,
    ...candidateEpic,
    ...chatEpic,
    ...recruitmentEpic,
    ...smsEpic,
    ...websocketEpic
);

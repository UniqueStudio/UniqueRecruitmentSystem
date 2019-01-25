import { combineEpics, createEpicMiddleware, EpicMiddleware } from 'redux-observable';
import { BehaviorSubject, of } from 'rxjs';

import io from 'socket.io-client';

import { VariantType } from 'notistack';

import { enqueueSnackbar } from 'Actions';
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

interface ActionType {
    START: string;
    SUCCESS: string;
    FAILURE: string;
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

function actionTypeCreator(action: string) {
    return {
        START: `${action}_START`,
        SUCCESS: `${action}_SUCCESS`,
        FAILURE: `${action}_FAILURE`,
    };
}

export const USER = actionTypeCreator('USER');
export const CANDIDATE = actionTypeCreator('CANDIDATE');
export const COMMENT = actionTypeCreator('COMMENT');
export const RECRUITMENT = actionTypeCreator('RECRUITMENT');
export const SMS = actionTypeCreator('SMS');

export const errHandler = (err: CustomError, action: ActionType, customAction?: Action) => of(...[
    enqueueSnackbar(`ERROR: ${err.message}`, { variant: err.type || 'error' }),
    { type: action.FAILURE },
].concat(customAction || []));

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

import { combineEpics, createEpicMiddleware, EpicMiddleware } from "redux-observable";
import userEpic from './user';
import candidateEpic from './candidate';
import chatEpic from './chat';
import recruitmentEpic from './recruitment';
import smsEpic from './sms';
import { StoreState } from '../reducer';
import { BehaviorSubject, of } from 'rxjs';
import io from 'socket.io-client';
import { toggleSnackbarOn } from '../action';
import { socketConnectEpic, socketReceiveEpic } from './webSocket';

export type Socket = typeof io.Socket;

export interface Action {
    type: string;
}

interface CustomError {
    message: string;
    type: string;
}

interface actionType {
    START: string;
    SUCCESS: string;
    FAILURE: string;
}

export const customError = (obj: object) => {
    const err = new Error(obj['message']);
    err['type'] = obj['type'];
    return err;
};

function actionTypeCreator(action: string) {
    return {
        START: `${action}_START`,
        SUCCESS: `${action}_SUCCESS`,
        FAILURE: `${action}_FAILURE`,
    }
}

export const USER = actionTypeCreator('USER');
export const CANDIDATE = actionTypeCreator('CANDIDATE');
export const COMMENT = actionTypeCreator('COMMENT');
export const RECRUITMENT = actionTypeCreator('RECRUITMENT');
export const SMS = actionTypeCreator('SMS');


export const errHandler = (err: CustomError, type: actionType) => of(
    toggleSnackbarOn(`ERROR: ${err.message}`, err.type || 'danger'),
    { type: type.FAILURE });

const dependencies = { io, socket$: new BehaviorSubject(null), sessionStorage };

export type Dependencies = typeof dependencies;

export const epicMiddleware: EpicMiddleware<Action, Action, StoreState> = createEpicMiddleware({
    dependencies
});

export const epics = combineEpics(
    ...userEpic,
    ...candidateEpic,
    ...chatEpic,
    ...recruitmentEpic,
    ...smsEpic,
    socketConnectEpic,
    socketReceiveEpic
);
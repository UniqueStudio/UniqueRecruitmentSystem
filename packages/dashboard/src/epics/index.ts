import { Action, AnyAction } from 'redux';
import {
    ActionsObservable,
    combineEpics,
    createEpicMiddleware,
    EpicMiddleware,
    StateObservable,
} from 'redux-observable';
import { BehaviorSubject, Observable, of } from 'rxjs';

import io, { Socket } from 'socket.io-client';

import { VariantType } from 'notistack';

import { store } from '../App';

import { enqueueSnackbar, toggleProgress } from '../actions';
import { StoreState } from '../reducers';
import { localStorage } from '../utils/storage';

import candidateEpic from './candidate';
import chatEpic from './chat';
import recruitmentEpic from './recruitment';
import smsEpic from './sms';
import userEpic from './user';
import websocketEpic from './websocket';

interface CustomError extends Error {
    message: string;
    type?: VariantType;
}

export const customError = (error: object) => {
    const err = new Error(error['message']);
    err['type'] = error['type'];
    return err as CustomError;
};

export const errHandler = ({ message, type }: CustomError, customAction?: AnyAction) =>
    customAction
        ? of(enqueueSnackbar(`ERROR: ${message}`, { variant: type || 'error' }), toggleProgress(), customAction)
        : of(enqueueSnackbar(`ERROR: ${message}`, { variant: type || 'error' }), toggleProgress());

export const checkToken = () => {
    const token = store.getState().user.token;
    if (!token) {
        throw customError({ message: 'token不存在' });
    }
    return token;
};

const dependencies = { io, socket$: new BehaviorSubject((null as unknown) as typeof Socket), localStorage };

export type Dependencies = typeof dependencies;

export type Epic<T extends Action = Action> = (
    action$: ActionsObservable<T>,
    state$: StateObservable<StoreState>,
    dependencies: Dependencies,
) => Observable<AnyAction>;

export const epicMiddleware: EpicMiddleware<Action, Action, StoreState> = createEpicMiddleware({
    dependencies,
});

export const epics = combineEpics(
    ...userEpic,
    ...candidateEpic,
    ...chatEpic,
    ...recruitmentEpic,
    ...smsEpic,
    ...websocketEpic,
);

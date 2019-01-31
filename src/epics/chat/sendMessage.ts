import { Epic, ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { addMessage, SEND_MESSAGE, SendMessage } from 'Actions';
import { StoreState } from 'Reducers';

import { Action, checkToken, Dependencies, errHandler, Socket } from 'Epics';

export const sendMessageEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket: Socket) => {
            if (!socket) {
                return EMPTY;
            }
            return action$.pipe(
                ofType(SEND_MESSAGE),
                tap(({ message }: SendMessage) => {
                    checkToken();
                    socket.emit('sendMessage', { message });
                }),
                map(({ message }) => {
                    return addMessage(message);
                }),
                catchError((err) => errHandler(err))
            );
        }),
        catchError((err) => errHandler(err))
    );

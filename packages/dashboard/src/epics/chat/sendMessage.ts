import { ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { addMessage, SendMessage, SEND_MESSAGE } from '../../actions';

import { checkToken, Epic, errHandler } from '../';

export const sendMessageEpic: Epic<SendMessage> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket) => {
            if (!socket) {
                return EMPTY;
            }
            return action$.pipe(
                ofType(SEND_MESSAGE),
                tap(({ message }) => {
                    checkToken();
                    socket.emit('sendMessage', { message });
                }),
                map(({ message }) => {
                    return addMessage(message);
                }),
                catchError((err) => errHandler(err)),
            );
        }),
        catchError((err) => errHandler(err)),
    );

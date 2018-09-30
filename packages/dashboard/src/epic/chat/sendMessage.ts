import { Epic, ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Action, Dependencies, errHandler, Socket, USER } from '../index';

import { addMessage, SEND_MESSAGE, SendMessage } from '../../action';
import { StoreState } from '../../reducer';

export const sendMessageEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { localStorage, socket$ }) =>
    socket$.pipe(
        switchMap((socket: Socket) => {
            if (socket) {
                return action$.pipe(
                    ofType(SEND_MESSAGE),
                    map((action: SendMessage) => {
                        const { message } = action;
                        const name = state$.value.user.info.username;
                        const avatar = state$.value.user.info.avatar;
                        const time = +new Date();
                        return { message, name, avatar, time };
                    }),
                    tap((obj) => {
                        const token = localStorage.getItem('token');
                        if (!token) {
                            errHandler({ message: 'token不存在', type: 'danger' }, USER);
                        }
                        const { name, avatar, time, message } = obj;
                        socket.emit('sendMessage', name, avatar, time, message, false);
                    }),
                    map((obj) => {
                        const { name, avatar, time, message } = obj;
                        return addMessage(name, avatar, time, message, true);
                    }),
                );
            }
            return EMPTY;
        }),
    );

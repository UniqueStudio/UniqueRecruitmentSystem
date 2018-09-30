import { Epic, ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Action, COMMENT, Dependencies, errHandler, Socket } from '../index';

import { REMOVE_COMMENT_START, RemoveCommentStart } from '../../action';
import { StoreState } from '../../reducer';

export const removeCommentEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { socket$, localStorage }) =>
    socket$.pipe(
        switchMap((socket: Socket) => {
            if (socket) {
                return action$.pipe(
                    ofType(REMOVE_COMMENT_START),
                    tap((action: RemoveCommentStart) => {
                        const { cid, step, commenter } = action;
                        const token = localStorage.getItem('token');
                        if (!token) {
                            errHandler({ message: 'token不存在', type: 'danger' }, COMMENT);
                        }
                        socket.emit('removeComment', step, cid, commenter, token);
                    }),
                    map(() => ({ type: COMMENT.START })),
                );
            }
            return EMPTY;
        }),
    );

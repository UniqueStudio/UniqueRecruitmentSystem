import { Epic, ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { REMOVE_COMMENT_START, RemoveCommentStart, toggleProgress } from 'Actions';
import { StoreState } from 'Reducers';

import { Action, checkToken, Dependencies, errHandler, Socket } from 'Epics';

export const removeCommentEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket: Socket) => {
            if (!socket) {
                return EMPTY;
            }
            return action$.pipe(
                ofType(REMOVE_COMMENT_START),
                tap((action: RemoveCommentStart) => {
                    const { cid, id } = action;
                    const token = checkToken();
                    socket.emit('removeComment', { cid, id, token });
                }),
                map(() => toggleProgress(true)),
                catchError((err) => errHandler(err))
            );
        }),
    );

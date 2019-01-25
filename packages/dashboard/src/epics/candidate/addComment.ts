import { Epic, ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { ADD_COMMENT_START, AddCommentStart } from 'Actions';
import { StoreState } from 'Reducers';

import { Action, checkToken, COMMENT, Dependencies, errHandler, Socket } from 'Epics';

export const addCommentEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket: Socket) => {
            if (!socket) {
                return EMPTY;
            }
            return action$.pipe(
                ofType(ADD_COMMENT_START),
                tap((action: AddCommentStart) => {
                    const { cid, comment } = action;
                    const token = checkToken();
                    socket.emit('addComment', { cid, comment, token });
                }),
                map(() => ({ type: COMMENT.START })),
                catchError((err) => errHandler(err, COMMENT))
            );
        }),
    );

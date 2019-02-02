import { ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { REMOVE_COMMENT_START, RemoveCommentStart, toggleProgress } from '../../actions';

import { checkToken, Epic, errHandler } from '../';

export const removeCommentEpic: Epic<RemoveCommentStart> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket) => {
            if (!socket) {
                return EMPTY;
            }
            return action$.pipe(
                ofType(REMOVE_COMMENT_START),
                tap((action) => {
                    const { cid, id } = action;
                    const token = checkToken();
                    socket.emit('removeComment', { cid, id, token });
                }),
                map(() => toggleProgress(true)),
                catchError((err) => errHandler(err))
            );
        }),
    );

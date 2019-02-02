import { ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { ADD_COMMENT_START, AddCommentStart, toggleProgress } from '../../actions';

import { checkToken, Epic, errHandler } from '../';

export const addCommentEpic: Epic<AddCommentStart> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket) => {
            if (!socket) {
                return EMPTY;
            }
            return action$.pipe(
                ofType(ADD_COMMENT_START),
                tap((action) => {
                    const { cid, comment } = action;
                    const token = checkToken();
                    socket.emit('addComment', { cid, comment, token });
                }),
                map(() => toggleProgress(true)),
                catchError((err) => errHandler(err))
            );
        }),
    );

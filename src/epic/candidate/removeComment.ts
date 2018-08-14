import { map, switchMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import { Action, COMMENT, Dependencies, errHandler } from '../index';
import { REMOVE_COMMENT_START, RemoveCommentStart } from '../../action';
import { StoreState } from '../../reducer';

export const removeCommentEpic: Epic<Action, any, StoreState, Dependencies> = (action$, state$, { sessionStorage, socket$ }) =>
    socket$.pipe(
        switchMap((socket: any) => {
            if (socket) {
                return action$.pipe(
                    ofType(REMOVE_COMMENT_START),
                    tap((action: RemoveCommentStart) => {
                        const { cid, step, commenter } = action;
                        const token = sessionStorage.getItem('token');
                        if (!token) {
                            errHandler({ message: 'token不存在', type: 'danger' }, COMMENT);
                        }
                        socket.emit('removeComment', step, cid, commenter, token);
                    }),
                    map(() => ({ type: COMMENT.START }))
                )
            }
            return EMPTY;
        })
    );


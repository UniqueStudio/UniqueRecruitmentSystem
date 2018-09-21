import { map, switchMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import { Action, COMMENT, Dependencies, errHandler, Socket } from '../index';
import { ADD_COMMENT_START, AddCommentStart } from '../../action';
import { StoreState } from '../../reducer';

export const addCommentEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { localStorage, socket$ }) =>
    socket$.pipe(
        switchMap((socket: Socket) => {
            if (socket) {
                return action$.pipe(
                    ofType(ADD_COMMENT_START),
                    tap((action: AddCommentStart) => {
                        const { cid, step, comment, commenter } = action;
                        const token = localStorage.getItem('token');
                        if (!token) {
                            errHandler({ message: 'token不存在', type: 'danger' }, COMMENT);
                        }
                        socket.emit('addComment', step, cid, commenter, comment, token);
                    }),
                    map(() => ({ type: COMMENT.START }))
                )
            }
            return EMPTY;
        })
    );


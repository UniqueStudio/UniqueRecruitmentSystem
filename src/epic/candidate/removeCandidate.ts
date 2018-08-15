import { map, switchMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import { Action, CANDIDATE, Dependencies, errHandler, Socket } from '../index';
import { REMOVE_CANDIDATE_START, RemoveCandidateStart } from '../../action';
import { StoreState } from '../../reducer';


export const removeCandidateEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage, socket$ }) =>
    socket$.pipe(
        switchMap((socket: Socket) => {
            if (socket) {
                return action$.pipe(
                    ofType(REMOVE_CANDIDATE_START),
                    tap((action: RemoveCandidateStart) => {
                        const token = sessionStorage.getItem('token');
                        if (!token) {
                            errHandler({ message: 'token不存在', type: 'danger' }, CANDIDATE);
                        }
                        socket.emit('removeCandidate', action.cid, token);
                    }),
                    map(() => ({ type: CANDIDATE.START }))
                )
            }
            return EMPTY;
        })
    );


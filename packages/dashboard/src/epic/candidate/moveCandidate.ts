import { mergeMap, switchMap, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import { Action, CANDIDATE, Dependencies, errHandler, Socket } from '../index';
import { MOVE_CANDIDATE_START, moveCandidateFulfilled, MoveCandidateStart } from '../../action';
import { StoreState } from '../../reducer';

export const moveCandidateEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage, socket$, localStorage }) =>
    socket$.pipe(
        switchMap((socket: Socket) => {
            if (socket) {
                return action$.pipe(
                    ofType(MOVE_CANDIDATE_START),
                    tap((action: MoveCandidateStart) => {
                        const { cid, from, to } = action;
                        const token = localStorage.getItem('token');
                        if (!token) {
                            errHandler({ message: 'token不存在', type: 'danger' }, CANDIDATE);
                        }
                        socket.emit('moveCandidate', cid, from, to, token);
                    }),
                    mergeMap((action: MoveCandidateStart) => {
                        const { cid, from, position, to } = action;
                        return of(
                            // Try to move, move back if failed
                            moveCandidateFulfilled(from, to, cid, position),
                            { type: CANDIDATE.START },
                        )
                    })
                )
            }
            return EMPTY;
        })
    );


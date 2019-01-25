import { Epic, ofType } from 'redux-observable';
import { EMPTY, of } from 'rxjs';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';

import { MOVE_CANDIDATE_START, moveCandidateFulfilled, MoveCandidateStart } from 'Actions';
import { StoreState } from 'Reducers';

import { Action, CANDIDATE, checkToken, Dependencies, errHandler, Socket } from 'Epics';

export const moveCandidateEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket: Socket) => {
            if (socket) {
                return action$.pipe(
                    ofType(MOVE_CANDIDATE_START),
                    tap((action: MoveCandidateStart) => {
                        const { cid, from, to } = action;
                        const token = checkToken();
                        socket.emit('moveCandidate', { cid, from, to, token });
                    }),
                    mergeMap((action: MoveCandidateStart) => {
                        const { cid, from, position, to } = action;
                        return of(
                            // Try to move, move back if failed
                            moveCandidateFulfilled(from, to, cid, position),
                            { type: CANDIDATE.START },
                        );
                    }),
                    catchError((err) => errHandler(err, CANDIDATE))
                );
            }
            return EMPTY;
        }),
    );

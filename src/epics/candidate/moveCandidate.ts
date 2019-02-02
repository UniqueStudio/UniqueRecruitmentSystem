import { ofType } from 'redux-observable';
import { EMPTY, of } from 'rxjs';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';

import { MOVE_CANDIDATE_START, moveCandidateFulfilled, MoveCandidateStart, toggleProgress } from '../../actions';

import { checkToken, Epic, errHandler } from '../';

export const moveCandidateEpic: Epic<MoveCandidateStart> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket) => {
            if (socket) {
                return action$.pipe(
                    ofType(MOVE_CANDIDATE_START),
                    tap((action) => {
                        const { cid, from, to } = action;
                        const token = checkToken();
                        socket.emit('moveCandidate', { cid, from, to, token });
                    }),
                    mergeMap((action) => {
                        const { cid, from, position, to } = action;
                        return of(
                            // Try to move, move back if failed
                            moveCandidateFulfilled(from, to, cid, position),
                            toggleProgress(true),
                        );
                    }),
                    catchError((err) => errHandler(err))
                );
            }
            return EMPTY;
        }),
    );

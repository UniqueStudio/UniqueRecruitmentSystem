import { Epic, ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { REMOVE_CANDIDATE_START, RemoveCandidateStart, toggleProgress } from 'Actions';
import { StoreState } from 'Reducers';

import { Action, checkToken, Dependencies, errHandler, Socket } from 'Epics';

export const removeCandidateEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket: Socket) => {
            if (socket) {
                return action$.pipe(
                    ofType(REMOVE_CANDIDATE_START),
                    tap(({ cid }: RemoveCandidateStart) => {
                        const token = checkToken();
                        socket.emit('removeCandidate', { cid, token });
                    }),
                    map(() => toggleProgress(true)),
                    catchError((err) => errHandler(err))
                );
            }
            return EMPTY;
        }),
    );

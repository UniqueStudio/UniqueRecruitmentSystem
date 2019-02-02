import { ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { REMOVE_CANDIDATE_START, RemoveCandidateStart, toggleProgress } from '../../actions';

import { checkToken, Epic, errHandler } from '../';

export const removeCandidateEpic: Epic<RemoveCandidateStart> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket) => {
            if (socket) {
                return action$.pipe(
                    ofType(REMOVE_CANDIDATE_START),
                    tap(({ cid }) => {
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

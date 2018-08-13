import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { fromEvent, of, race } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import { CandidateAction } from './index';
import { REMOVE_CANDIDATE_START, removeCandidateFulFilled, RemoveCandidateStart, toggleSnackbarOn } from '../../action';
import { customError } from '../index';
import { socket } from '../webSocket';

export const removeCandidateEpic: Epic<CandidateAction> = action$ =>
    action$.pipe(
        ofType(REMOVE_CANDIDATE_START),
        tap((action: RemoveCandidateStart) => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw customError({ message: 'token不存在', type: 'danger' });
            }
            socket.emit('removeCandidate', action.cid, token);
        }),
        mergeMap(() =>
            race(
                fromEvent(socket, 'removeCandidate').pipe(
                    map((cid: string) => removeCandidateFulFilled(cid))
                ),
                fromEvent(socket, 'removeCandidateError').pipe(
                    map(err => {
                        throw customError({ message: err[0], type: err[1] })
                    })
                ),
            )
        ),
        catchError(err => of(
            toggleSnackbarOn(`Error: ${err.message}`, err.type || 'danger'),
        ))
    );

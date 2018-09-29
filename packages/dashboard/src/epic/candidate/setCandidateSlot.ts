import { catchError, endWith, mergeMap, startWith } from 'rxjs/operators';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { of } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import { Action, CANDIDATE, customError, Dependencies, errHandler } from '../index';
import { SET_CANDIDATE_SLOT, SetCandidateSlot, setSlots, toggleSnackbarOn } from '../../action';
import { URL } from '../../lib/const';
import { StoreState } from '../../reducer';

export const setCandidateSlotEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { localStorage }) =>
    action$.pipe(
        ofType(SET_CANDIDATE_SLOT),
        mergeMap((action: SetCandidateSlot) => {
            const token = localStorage.getItem('token');
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, CANDIDATE);
            }
            const { time, id } = action;
            return ajax.put(`${URL}/candidates/${id}`, JSON.stringify({ patch: time }), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                mergeMap((response: AjaxResponse) => {
                    const res = response.response;
                    if (res.type === 'success') {
                        return of(
                            toggleSnackbarOn('设置成功！', 'success'),
                            setSlots([{ _id: id, ...time }], time['slot1'] ? 1 : 2)
                        );
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: CANDIDATE.START }
                ),
                endWith(
                    { type: CANDIDATE.SUCCESS },
                ),
                catchError(err => errHandler(err, CANDIDATE))
            )
        }),
    );

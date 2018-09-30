import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, endWith, mergeMap, startWith } from 'rxjs/operators';

import { Action, CANDIDATE, customError, Dependencies, errHandler } from '../index';

import { SET_ONE_SLOT_START, SetOneSlotStart, setSlotsFulfilled, toggleSnackbarOn } from '../../action';
import { StoreState } from '../../reducer';

import { URL } from '../../lib/const';

export const setOneSlotEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { localStorage }) =>
    action$.pipe(
        ofType(SET_ONE_SLOT_START),
        mergeMap((action: SetOneSlotStart) => {
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
                            setSlotsFulfilled([{ _id: id, ...time }], time['slot1'] ? 1 : 2),
                        );
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: CANDIDATE.START },
                ),
                endWith(
                    { type: CANDIDATE.SUCCESS },
                ),
                catchError((err) => errHandler(err, CANDIDATE)),
            );
        }),
    );

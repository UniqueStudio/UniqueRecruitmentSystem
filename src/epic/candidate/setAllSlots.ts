import { catchError, mergeMap, startWith } from 'rxjs/operators';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { of } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import { Action, CANDIDATE, customError, Dependencies, errHandler } from '../index';
import { SET_All_SLOTS_START, SetAllSlotsStart, setSlotsFulfilled, toggleSnackbarOn } from '../../action';
import { URL } from '../../lib/const';
import { StoreState } from '../../reducer';

export const setAllSlotsEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { localStorage }) =>
    action$.pipe(
        ofType(SET_All_SLOTS_START),
        mergeMap((action: SetAllSlotsStart) => {
            const token = localStorage.getItem('token');
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, CANDIDATE);
            }
            const { title, slots, group } = action;
            return ajax.post(`${URL}/recruitment/${title}/slots`, JSON.stringify({ slots, group }), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                mergeMap((response: AjaxResponse) => {
                    const res = response.response;
                    const message = res.failed === 0 ? '所有候选人均分配了时间！' : `有${res.failed}位候选人没有分配到时间！`;
                    if (res.type === 'success') {
                        return of(
                            setSlotsFulfilled(res.result, res.interview),
                            toggleSnackbarOn(message, 'success'),
                            { type: CANDIDATE.SUCCESS }
                        );
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: CANDIDATE.START }
                ),
                catchError(err => errHandler(err, CANDIDATE))
            )
        }),
    );

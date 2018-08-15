import { catchError, endWith, mergeMap, startWith } from 'rxjs/operators';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { of } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import { Action, CANDIDATE, customError, Dependencies, errHandler } from '../index';
import { setSlots, SUBMIT_SLOTS, SubmitSlots, toggleSnackbarOn } from '../../action';
import { URL } from '../../lib/const';
import { StoreState } from '../../reducer';

export const submitSlotsEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage }) =>
    action$.pipe(
        ofType(SUBMIT_SLOTS),
        mergeMap((action: SubmitSlots) => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, CANDIDATE);
            }
            const { title, slots, group } = action;
            return ajax.post(`${URL}/recruitment/slots`, JSON.stringify({ title, slots, group }), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                mergeMap((response: AjaxResponse) => {
                    const res = response.response;
                    if (res.type === 'success') {
                        return of(
                            setSlots(res.result, res.interview),
                            res.failed === 0
                                ? toggleSnackbarOn('所有候选人均分配了时间！', 'success')
                                : toggleSnackbarOn(`有${res.failed}位候选人没有分配到时间！`, 'info')
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

import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { ALLOCATE_ONE_START, allocateOneFulfilled, AllocateOneStart, enqueueSnackbar, toggleProgress } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, checkToken, customError, Dependencies, errHandler } from 'Epics';

export const allocateOneEpic: Epic<Action, Action, StoreState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(ALLOCATE_ONE_START),
        mergeMap((action: AllocateOneStart) => {
            const token = checkToken();
            const { time, cid, interviewType } = action;
            return ajax.put(`${API}/candidate/${cid}/interview/${interviewType}`, JSON.stringify({ time }), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                mergeMap(({ response: res }: AjaxResponse) => {
                    if (res.type === 'success') {
                        return of(
                            enqueueSnackbar('设置成功！', { variant: 'success' }),
                            allocateOneFulfilled(cid, time, interviewType),
                            toggleProgress()
                        );
                    }
                    throw customError(res);
                }),
                startWith(toggleProgress(true)),
                catchError((err) => errHandler(err)),
            );
        }),
        catchError((err) => errHandler(err)),
    );

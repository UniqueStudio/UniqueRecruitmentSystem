import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, endWith, mergeMap, startWith } from 'rxjs/operators';

import { ALLOCATE_ONE_START, allocateOneFulfilled, AllocateOneStart, enqueueSnackbar } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, CANDIDATE, checkToken, customError, Dependencies, errHandler } from 'Epics';

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
        catchError((err) => errHandler(err, CANDIDATE)),
    );

import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { allocateAllFulfilled, AllocateAllFulfilled, AllocateAllStart, ALLOCATE_ALL_START, enqueueSnackbar, toggleProgress } from '../../actions';

import { API } from '../../config/consts';

import { checkToken, customError, Epic, errHandler } from '../';

export const allocateAllEpic: Epic<AllocateAllStart> = (action$, state$) =>
    action$.pipe(
        ofType(ALLOCATE_ALL_START),
        mergeMap((action) => {
            const token = checkToken();
            const { interviewType } = action;
            const { viewing } = state$.value.recruitment;
            return ajax.put(`${API}/candidate/interview/${interviewType}`, JSON.stringify({ title: viewing }), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                mergeMap(({ response: res }) => {
                    if (res.type !== 'success') {
                        throw customError(res);
                    }
                    const allocations = res.allocations as AllocateAllFulfilled['data'];
                    const failed = allocations.filter(({ time }) => !time).length;
                    const message = failed ? `有${failed}位候选人没有分配到时间！(不包括未选择时间的)` : '所有候选人均分配了时间！(不包括未选择时间的)';
                    return of(
                        allocateAllFulfilled(allocations, interviewType),
                        enqueueSnackbar(message, { variant: failed ? 'info' : 'success' }),
                        toggleProgress(),
                    );
                }),
                startWith(toggleProgress(true)),
                catchError((err) => errHandler(err)),
            );
        }),
        catchError((err) => errHandler(err)),
    );

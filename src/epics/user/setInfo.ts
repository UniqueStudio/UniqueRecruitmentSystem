import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, SET_USER_INFO_START, SetUserInfoStart, toggleProgress, userInfoFulfilled } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, checkToken, customError, Dependencies, errHandler } from 'Epics';

export const setInfoEpic: Epic<Action, Action, StoreState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(SET_USER_INFO_START),
        mergeMap((action: SetUserInfoStart) => {
            const token = checkToken();
            const { info } = action;
            return ajax.put(`${API}/user/`, JSON.stringify(info), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                mergeMap(({ response: res }: AjaxResponse) => {
                    if (res.type === 'success') {
                        return of(
                            userInfoFulfilled(info),
                            toggleProgress(),
                            enqueueSnackbar('已成功修改信息！', { variant: 'success' }),
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

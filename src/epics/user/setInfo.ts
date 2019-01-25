import { Epic, ofType } from 'redux-observable';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, SET_USER_INFO_START, SetUserInfoStart, userInfoFulfilled } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, checkToken, customError, Dependencies, errHandler, USER } from 'Epics';

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
                map(({ response: res }: AjaxResponse) => {
                    if (res.type === 'success') {
                        return userInfoFulfilled(info);
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: USER.START },
                ),
                endWith(
                    { type: USER.SUCCESS },
                    enqueueSnackbar('已成功修改信息！', {
                        variant: 'success'
                    }),
                ),
                catchError((err) => errHandler(err, USER)),
            );
        }),
        catchError((err) => errHandler(err, USER)),
    );

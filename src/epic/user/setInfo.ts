import { Epic, ofType } from 'redux-observable';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith, tap } from 'rxjs/operators';

import { Action, customError, Dependencies, errHandler, USER } from '../index';

import { SET_USER_INFO_START, SetUserInfoStart, toggleSnackbarOn, userInfoFulfilled } from '../../action';
import { StoreState } from '../../reducer';

import { URL } from '../../lib/const';

export const setInfoEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage, localStorage }) =>
    action$.pipe(
        ofType(SET_USER_INFO_START),
        mergeMap((action: SetUserInfoStart) => {
            const token = localStorage.getItem('token');
            const formerInfo = localStorage.getItem('userInfo') || '{}';
            const { uid, info } = action;
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, USER);
            }
            return ajax.put(`${URL}/user/${uid}`, JSON.stringify({ uid, ...info }), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                map((response: AjaxResponse) => {
                    const res = response.response;
                    if (res.type === 'success') {
                        return userInfoFulfilled(info);
                    }
                    throw customError(res);
                }),
                tap(() => localStorage.setItem('userInfo', JSON.stringify({ ...JSON.parse(formerInfo), ...info }))),
                startWith(
                    { type: USER.START },
                ),
                endWith(
                    { type: USER.SUCCESS },
                    toggleSnackbarOn('已成功修改信息！', 'success'),
                ),
                catchError((err) => errHandler(err, USER)),
            );
        }),
    );

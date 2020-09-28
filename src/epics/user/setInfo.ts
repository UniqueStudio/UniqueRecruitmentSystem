import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import {
    enqueueSnackbar,
    SetUserInfoStart,
    SET_USER_INFO_START,
    toggleProgress,
    userInfoFulfilled,
} from '../../actions';

import { API } from '../../config/consts';

import { checkToken, customError, Epic, errHandler } from '../';

export const setInfoEpic: Epic<SetUserInfoStart> = (action$) =>
    action$.pipe(
        ofType(SET_USER_INFO_START),
        mergeMap((action) => {
            const token = checkToken();
            const { info } = action;
            return ajax
                .put(`${API}/user/`, JSON.stringify(info), {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                })
                .pipe(
                    mergeMap(({ response: res }) => {
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

import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { USER, UserAction } from './index';
import { setUserInfo, toggleSnackbarOn, UPDATE_USER_INFO, UpdateUserInfo } from '../../action';
import { URL } from '../../lib/const';
import { customError } from '../index';

export const updateInfoEpic: Epic<UserAction> = action$ =>
    action$.pipe(
        ofType(UPDATE_USER_INFO),
        mergeMap((action: UpdateUserInfo) => {
            const token = sessionStorage.getItem('token');
            const formerInfo = sessionStorage.getItem('userInfo') || '{}';
            const { uid, info } = action;
            if (!token) {
                throw customError({ message: 'token不存在', type: 'danger' });
            }
            return ajax.put(`${URL}/user/${uid}`, JSON.stringify({ uid, ...info }), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                map((response: any) => {
                    const res = response.response;
                    if (res.type === 'success') {
                        sessionStorage.setItem('userInfo', JSON.stringify({ ...JSON.parse(formerInfo), ...info }));
                        return setUserInfo(info);
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: USER.START }
                ),
                endWith(
                    { type: USER.SUCCESS },
                    toggleSnackbarOn('已成功修改信息！', 'success')
                ),
            )
        }),
        catchError(err => of(
            toggleSnackbarOn(`Error: ${err.message}`, err.type || 'danger'),
            { type: USER.FAILURE }
        ))
    );

import { catchError, endWith, map, mergeMap, startWith, tap } from 'rxjs/operators';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { Action, customError, Dependencies, errHandler, USER } from '../index';
import { setUserInfo, toggleSnackbarOn, UPDATE_USER_INFO, UpdateUserInfo } from '../../action';
import { URL } from '../../lib/const';
import { StoreState } from '../../reducer';

export const updateInfoEpic: Epic<Action, any, StoreState, Dependencies> = (action$, state$, { sessionStorage }) =>
    action$.pipe(
        ofType(UPDATE_USER_INFO),
        mergeMap((action: UpdateUserInfo) => {
            const token = sessionStorage.getItem('token');
            const formerInfo = sessionStorage.getItem('userInfo') || '{}';
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
                        return setUserInfo(info);
                    }
                    throw customError(res);
                }),
                tap(() => sessionStorage.setItem('userInfo', JSON.stringify({ ...JSON.parse(formerInfo), ...info }))),
                startWith(
                    { type: USER.START }
                ),
                endWith(
                    { type: USER.SUCCESS },
                    toggleSnackbarOn('已成功修改信息！', 'success')
                ),
                catchError(err => errHandler(err, USER))
            )
        }),
    );

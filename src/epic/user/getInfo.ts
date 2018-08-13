import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';
import { Epic, ofType } from "redux-observable";
import { GET_USER_INFO, GetUserInfo, setUserInfo, toggleSnackbarOn } from '../../action';
import { USER, UserAction } from './index';
import { URL } from '../../lib/const';
import { customError } from '../index';

export const getInfoEpic: Epic<UserAction> = action$ =>
    action$.pipe(
        ofType(GET_USER_INFO),
        mergeMap((action: GetUserInfo) => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw customError({ message: 'token不存在', type: 'danger' });
            }
            const user = sessionStorage.getItem('userInfo');
            if (user && action.uid === sessionStorage.getItem('uid')) {
                return of(
                    setUserInfo(JSON.parse(user)),
                );
            }
            return ajax.getJSON(`${URL}/user/${action.uid}`, {
                'Authorization': `Bearer ${token}`
            })
                .pipe(
                    map((res: any) => {
                        if (res.type === 'success') {
                            sessionStorage.setItem('userInfo', JSON.stringify(res.data));
                            return setUserInfo(res.data);
                        }
                        throw customError(res);
                    }),
                    startWith(
                        { type: USER.START }
                    ),
                    endWith(
                        { type: USER.SUCCESS },
                    ),
                )
        }),
        catchError(err => of(
            toggleSnackbarOn(`Error: ${err.message}`, err.type || 'danger'),
            { type: USER.FAILURE }
        ))
    );

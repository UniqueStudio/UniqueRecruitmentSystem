import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith, tap } from 'rxjs/operators';

import { Action, Dependencies, errHandler, USER } from '../index';

import { GET_USER_INFO_START, GetUserInfoStart, userInfoFulfilled } from '../../action';
import { StoreState } from '../../reducer';

import { URL, User } from '../../lib/const';

export const getInfoEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage, localStorage }) =>
    action$.pipe(
        ofType(GET_USER_INFO_START),
        mergeMap((action: GetUserInfoStart) => {
            const token = localStorage.getItem('token');
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, USER);
            }
            const user = localStorage.getItem('userInfo');
            if (user && action.uid === JSON.parse(user)._id) {
                return of(
                    userInfoFulfilled(JSON.parse(user)),
                );
            }
            return ajax.getJSON(`${URL}/user/${action.uid}`, {
                Authorization: `Bearer ${token}`,
            })
                .pipe(
                    map((res: { type: string, data: User }) => {
                        if (res.type === 'success') {
                            return res.data;
                        }
                        throw res;
                    }),
                    tap((data) => localStorage.setItem('userInfo', JSON.stringify(data))),
                    map((data) => userInfoFulfilled(data)),
                    startWith(
                        { type: USER.START },
                    ),
                    endWith(
                        { type: USER.SUCCESS },
                    ),
                    catchError((err) => errHandler(err, USER)),
                );
        }),
    );

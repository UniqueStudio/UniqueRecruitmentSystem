import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith, tap } from 'rxjs/operators';
import { Epic, ofType } from "redux-observable";
import { GET_USER_INFO, GetUserInfo, setUserInfo } from '../../action';
import { Action, Dependencies, errHandler, USER } from '../index';
import { URL, User } from '../../lib/const';
import { StoreState } from '../../reducer';

export const getInfoEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage, localStorage }) =>
    action$.pipe(
        ofType(GET_USER_INFO),
        mergeMap((action: GetUserInfo) => {
            const token = localStorage.getItem('token');
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, USER);
            }
            const user = localStorage.getItem('userInfo');
            if (user && action.uid === localStorage.getItem('uid')) {
                return of(
                    setUserInfo(JSON.parse(user)),
                );
            }
            return ajax.getJSON(`${URL}/user/${action.uid}`, {
                'Authorization': `Bearer ${token}`
            })
                .pipe(
                    map((res: { type: string, data: User }) => {
                        if (res.type === 'success') {
                            return res.data;
                        }
                        throw res;
                    }),
                    tap(data => localStorage.setItem('userInfo', JSON.stringify(data))),
                    map(data => setUserInfo(data)),
                    startWith(
                        { type: USER.START }
                    ),
                    endWith(
                        { type: USER.SUCCESS },
                    ),
                    catchError(err => errHandler(err, USER))
                )
        }),
    );
import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { GET_USER_INFO_START, setGroup, socketStart, toggleProgress, userInfoFulfilled } from '../../actions';

import { API } from '../../config/consts';
import { User } from '../../config/types';

import { checkToken, customError, Epic, errHandler } from '../';


export const getInfoEpic: Epic = (action$, state$, { localStorage }) =>
    action$.pipe(
        ofType(GET_USER_INFO_START),
        mergeMap(() => {
            const token = checkToken();
            const user = localStorage.getItem('user');
            if (user) {
                return of(userInfoFulfilled(user), setGroup(user.group), socketStart());
            }
            return ajax
                .getJSON<{ type: string; data: User }>(`${API}/user/`, {
                    Authorization: `Bearer ${token}`,
                })
                .pipe(
                    mergeMap((res) => {
                        if (res.type === 'success') {
                            const { data } = res;
                            return of(userInfoFulfilled(data), setGroup(data.group), socketStart(), toggleProgress());
                        }
                        throw customError(res);
                    }),
                    startWith(toggleProgress(true)),
                    catchError((err) => errHandler(err)),
                );
        }),
        catchError((err) => errHandler(err)),
    );

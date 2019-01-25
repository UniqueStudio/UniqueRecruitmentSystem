import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';

import { GET_USER_INFO_START, setGroup, socketStart, userInfoFulfilled } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';
import { User } from 'Config/types';

import { Action, checkToken, customError, Dependencies, errHandler, USER } from 'Epics';

export const getInfoEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage }) =>
    action$.pipe(
        ofType(GET_USER_INFO_START),
        mergeMap(() => {
            const token = checkToken();
            const user = sessionStorage.getItem('user');
            if (user) {
                return of(
                    userInfoFulfilled(JSON.parse(user)),
                    socketStart(),
                );
            }
            return ajax.getJSON(`${API}/user/`, {
                Authorization: `Bearer ${token}`,
            })
                .pipe(
                    map((res: { type: string, data: User }) => {
                        if (res.type === 'success') {
                            return res.data;
                        }
                        throw customError(res);
                    }),
                    mergeMap((data) => of(
                        userInfoFulfilled(data),
                        setGroup(data.group),
                        socketStart(),
                    )),
                    startWith(
                        { type: USER.START },
                    ),
                    endWith(
                        { type: USER.SUCCESS },
                    ),
                    catchError((err) => errHandler(err, USER)),
                );
        }),
        catchError((err) => errHandler(err, USER)),
    );

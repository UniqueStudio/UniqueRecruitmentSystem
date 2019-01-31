import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { GET_USER_INFO_START, setGroup, socketStart, toggleProgress, userInfoFulfilled } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';
import { User } from 'Config/types';

import { Action, checkToken, customError, Dependencies, errHandler } from 'Epics';

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
            }).pipe(
                mergeMap((res: { type: string, data: User }) => {
                    if (res.type === 'success') {
                        const { data } = res;
                        return of(
                            userInfoFulfilled(data),
                            setGroup(data.group),
                            socketStart(),
                            toggleProgress(),
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

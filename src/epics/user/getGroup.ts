import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';

import { GET_GROUP_INFO_START, getGroupInfoFulfilled } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';
import { User } from 'Config/types';

import { Action, checkToken, customError, Dependencies, errHandler, USER } from 'Epics';

export const getGroupEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage }) =>
    action$.pipe(
        ofType(GET_GROUP_INFO_START),
        mergeMap(() => {
            const token = checkToken();
            const groupInfo = sessionStorage.getItem('group');
            if (groupInfo && !state$.value.user.firstLoad) {
                return of(
                    getGroupInfoFulfilled(JSON.parse(groupInfo)),
                );
            }
            return ajax.getJSON(`${API}/user/group/`, {
                Authorization: `Bearer ${token}`,
            }).pipe(
                map((res: { type: string, data: User[] }) => {
                    if (res.type === 'success') {
                        return res.data;
                    }
                    throw customError(res);
                }),
                map((data) => getGroupInfoFulfilled(data)),
                startWith(
                    { type: USER.START },
                ),
                endWith(
                    { type: USER.SUCCESS },
                ),
                catchError((err) => errHandler(err, USER)));
        }),
        catchError((err) => errHandler(err, USER)),
    );

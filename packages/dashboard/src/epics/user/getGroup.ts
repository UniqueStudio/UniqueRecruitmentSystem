import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { GET_GROUP_INFO_START, getGroupInfoFulfilled, toggleProgress } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';
import { User } from 'Config/types';

import { Action, checkToken, customError, Dependencies, errHandler } from 'Epics';

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
                mergeMap((res: { type: string, data: User[] }) => {
                    if (res.type === 'success') {
                        return of(
                            getGroupInfoFulfilled(res.data),
                            toggleProgress(),
                        );
                    }
                    throw customError(res);
                }),
                startWith(toggleProgress(true)),
                catchError((err) => errHandler(err)));
        }),
        catchError((err) => errHandler(err)),
    );

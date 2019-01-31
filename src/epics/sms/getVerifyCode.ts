import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, GET_VERIFY_CODE, toggleProgress } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, checkToken, customError, Dependencies, errHandler } from 'Epics';

export const getCodeEpic: Epic<Action, Action, StoreState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(GET_VERIFY_CODE),
        mergeMap(() => {
            const token = checkToken();
            return ajax.getJSON(`${API}/sms/verification/user`, {
                Authorization: `Bearer ${token}`,
            }).pipe(
                mergeMap((res: { type: string }) => {
                    if (res.type === 'success') {
                        return of(
                            enqueueSnackbar('验证码已发送！', { variant: 'success' }),
                            toggleProgress(),
                        );
                    }
                    throw customError(res);
                }),
                startWith(toggleProgress(true)),
                catchError((err) => errHandler(err)),
            );
        }),
        catchError((err) => errHandler(err))
    );

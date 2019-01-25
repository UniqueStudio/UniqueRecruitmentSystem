import { Epic, ofType } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, GET_VERIFY_CODE } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, checkToken, customError, Dependencies, errHandler, SMS } from 'Epics';

export const getCodeEpic: Epic<Action, Action, StoreState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(GET_VERIFY_CODE),
        mergeMap(() => {
            const token = checkToken();
            return ajax.getJSON(`${API}/sms/verification/user`, {
                Authorization: `Bearer ${token}`,
            }).pipe(
                map((res: { type: string }) => {
                    if (res.type === 'success') {
                        return enqueueSnackbar('验证码已发送！', { variant: 'success' });
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: SMS.START },
                ),
                endWith(
                    { type: SMS.SUCCESS },
                ),
                catchError((err) => errHandler(err, SMS)),
            );
        }),
        catchError((err) => errHandler(err, SMS))
    );

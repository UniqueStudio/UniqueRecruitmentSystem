import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, SEND_SMS, SendSMS } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, checkToken, customError, Dependencies, errHandler, SMS } from 'Epics';

export const sendSMSEpic: Epic<Action, Action, StoreState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(SEND_SMS),
        mergeMap(({ content }: SendSMS) => {
            const token = checkToken();
            return ajax.post(`${API}/sms`, JSON.stringify(content), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                mergeMap(({ response: res }: AjaxResponse) => {
                    if (res.type === 'success') {
                        return of(
                            enqueueSnackbar('已成功发送短信', { variant: 'success' }),
                            { type: SMS.SUCCESS },
                        );
                    } else if (res.messages) {
                        return of(
                            ...res.messages.map((message: string) => enqueueSnackbar(message, { variant: res.type })),
                            { type: SMS.FAILURE },
                        );
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: SMS.START },
                ),
                catchError((err) => errHandler(err, SMS)),
            );
        }),
        catchError((err) => errHandler(err, SMS)),
    );

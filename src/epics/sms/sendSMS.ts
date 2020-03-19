import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, SendSMS, SEND_SMS, toggleProgress } from '../../actions';

import { API } from '../../config/consts';

import { checkToken, customError, Epic, errHandler } from '../';

export const sendSMSEpic: Epic<SendSMS> = (action$) =>
    action$.pipe(
        ofType(SEND_SMS),
        mergeMap(({ content }) => {
            const token = checkToken();
            return ajax.post(`${API}/sms`, JSON.stringify(content), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                mergeMap(({ response: res }) => {
                    const { type, messages } = res;
                    if (type === 'success') {
                        return of(
                            enqueueSnackbar('已成功发送短信', { variant: 'success' }),
                            toggleProgress(),
                        );
                    } else if (messages) {
                        return of(
                            ...messages.map((message: string) => enqueueSnackbar(message, { variant: type })),
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

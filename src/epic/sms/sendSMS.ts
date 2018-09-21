import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { Action, customError, Dependencies, errHandler, SMS } from '../index';
import { SEND_SMS, SendSMS, toggleSnackbarOn } from '../../action';
import { URL } from '../../lib/const';
import { StoreState } from '../../reducer';

export const sendSMSEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { localStorage }) =>
    action$.pipe(
        ofType(SEND_SMS),
        mergeMap((action: SendSMS) => {
            const token = localStorage.getItem('token');
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, SMS);
            }
            return ajax.post(`${URL}/sms`, JSON.stringify(action.content), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                map((response: AjaxResponse) => {
                    const res = response.response;
                    if (res.type === 'success') {
                        return toggleSnackbarOn('已成功发送短信', 'success');
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: SMS.START }
                ),
                endWith(
                    { type: SMS.SUCCESS },
                ),
                catchError(err => errHandler(err, SMS))
            )
        }),
    );

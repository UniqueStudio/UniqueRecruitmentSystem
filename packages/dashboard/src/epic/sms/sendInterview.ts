import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { Action, customError, Dependencies, errHandler, SMS } from '../index';
import { SEND_INTERVIEW, SendInterview, toggleSnackbarOn } from '../../action';
import { URL } from '../../lib/const';
import { StoreState } from '../../reducer';

export const sendInterviewEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage }) =>
    action$.pipe(
        ofType(SEND_INTERVIEW),
        mergeMap((action: SendInterview) => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, SMS);
            }
            return ajax.post(`${URL}/sms/interview`, JSON.stringify(action.content), {
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

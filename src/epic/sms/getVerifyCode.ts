import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { Action, customError, Dependencies, errHandler, SMS } from '../index';
import { GET_VERIFY_CODE, toggleSnackbarOn } from '../../action';
import { URL } from '../../lib/const';
import { StoreState } from '../../reducer';

export const getCodeEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { localStorage }) =>
    action$.pipe(
        ofType(GET_VERIFY_CODE),
        mergeMap(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, SMS);
            }
            return ajax.getJSON(`${URL}/verification/user`, {
                'Authorization': `Bearer ${token}`
            }).pipe(
                map((res: { type: string }) => {
                    if (res.type === 'success') {
                        return toggleSnackbarOn('验证码已发送！', 'success');
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

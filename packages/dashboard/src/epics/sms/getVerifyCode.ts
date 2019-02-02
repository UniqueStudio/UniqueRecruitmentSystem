import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, GET_VERIFY_CODE, toggleProgress } from '../../actions';

import { API } from '../../config/consts';

import { checkToken, customError, Epic, errHandler } from '../';

export const getCodeEpic: Epic = (action$) =>
    action$.pipe(
        ofType(GET_VERIFY_CODE),
        mergeMap(() => {
            const token = checkToken();
            return ajax.getJSON<{ type: string }>(`${API}/sms/verification/user`, {
                Authorization: `Bearer ${token}`,
            }).pipe(
                mergeMap((res) => {
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

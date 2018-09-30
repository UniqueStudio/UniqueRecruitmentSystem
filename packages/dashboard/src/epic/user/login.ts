import { Epic, ofType } from 'redux-observable';
import { concat, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, endWith, filter, map, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';

import { Action, customError, Dependencies, errHandler, USER } from '../index';

import {
    GET_QR_CODE_FULFILLED,
    GET_QR_CODE_START,
    GetQRCodeFulfilled,
    getQRCodeFulfilled,
    getUserInfoStart,
    login,
    toggleSnackbarOn,
} from '../../action';
import { StoreState } from '../../reducer';

import { URL } from '../../lib/const';

export const getQRCodeEpic: Epic<Action> = (action$) =>
    action$.pipe(
        ofType(GET_QR_CODE_START),
        mergeMap(() => ajax.getJSON(`${URL}/user`)
            .pipe(
                map((res: { type: string, key: string }) => {
                    if (res.type === 'success') {
                        return getQRCodeFulfilled(res.key);
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: USER.START },
                ),
                endWith(
                    toggleSnackbarOn('请尽快用企业微信扫描二维码！', 'info'),
                    { type: USER.SUCCESS },
                ),
                catchError((err) => errHandler(err, USER)),
            ),
        ),
    );

export const loginEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { localStorage }) =>
    action$.pipe(
        ofType(GET_QR_CODE_FULFILLED),
        filter((action: GetQRCodeFulfilled) => Boolean(action.key)),
        switchMap((action: GetQRCodeFulfilled) => ajax.getJSON(`${URL}/user/${action.key}/status`).pipe(
            map((res: { uid: string, token: string, type: string }) => {
                const { uid, token, type } = res;
                if (type === 'success') {
                    return { uid, token };
                }
                throw customError(res);
            }),
            tap((data) => {
                localStorage.setItem('token', data.token);
            }),
            mergeMap((data) => concat(
                of(login(data.uid)),
                of(getUserInfoStart(data.uid)),
            )),
            endWith(
                toggleSnackbarOn('已成功登录！', 'success'),
            ),
            catchError((err) => of(
                getQRCodeFulfilled(''),
                toggleSnackbarOn(`Error: ${err.message}`, err.type || 'danger'),
            )),
        )),
    );

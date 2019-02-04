import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, filter, mergeMap, startWith, switchMap } from 'rxjs/operators';

import {
    enqueueSnackbar,
    GET_QR_CODE_FULFILLED,
    GET_QR_CODE_START,
    GetQRCodeFulfilled,
    getQRCodeFulfilled,
    login, LOGIN_START, LoginStart,
    toggleProgress,
} from '../../actions';

import { API } from '../../config/consts';

import { customError, Epic, errHandler } from '../';

export const getQRCodeEpic: Epic = (action$) =>
    action$.pipe(
        ofType(GET_QR_CODE_START),
        mergeMap(() =>
            ajax.getJSON<{ type: string, key: string }>(`${API}/user/qrCode`)
                .pipe(
                    mergeMap((res) => {
                        if (res.type === 'success') {
                            return of(
                                getQRCodeFulfilled(res.key),
                                enqueueSnackbar('请尽快用企业微信扫描二维码！', { variant: 'info' }),
                                toggleProgress(),
                            );
                        }
                        throw customError(res);
                    }),
                    startWith(toggleProgress(true)),
                    catchError((err) => errHandler(err)),
                ),
        ),
        catchError((err) => errHandler(err)),
    );

export const scanQRCodeEpic: Epic<GetQRCodeFulfilled> = (action$) =>
    action$.pipe(
        ofType(GET_QR_CODE_FULFILLED),
        filter(({ key }) => !!key),
        switchMap((action) =>
            ajax.getJSON<{ token: string, type: string }>(`${API}/user/qrCode/${action.key}`).pipe(
                mergeMap((res) => {
                    const { token, type } = res;
                    if (type === 'success') {
                        return of(
                            login(token),
                            enqueueSnackbar('已成功登录！', { variant: 'success' }),
                            toggleProgress(),
                        );
                    }
                    throw customError(res);
                }),
                catchError((err) => errHandler(err, getQRCodeFulfilled(''))),
            )
        ),
        catchError((err) => errHandler(err, getQRCodeFulfilled(''))),
    );

export const loginEpic: Epic<LoginStart> = (action$) =>
    action$.pipe(
        ofType(LOGIN_START),
        mergeMap(({ phone, password }) =>
            ajax.post(`${API}/user/login`, JSON.stringify({ phone, password }), {
                'Content-Type': 'application/json',
            }).pipe(
                mergeMap(({ response: res }) => {
                    const { token, type } = res;
                    if (type === 'success') {
                        return of(
                            login(token),
                            enqueueSnackbar('已成功登录！', { variant: 'success' }),
                            toggleProgress(),
                        );
                    }
                    throw customError(res);
                }),
                startWith(toggleProgress(true)),
                catchError((err) => errHandler(err)),
            )
        ),
        catchError((err) => errHandler(err)),
    );

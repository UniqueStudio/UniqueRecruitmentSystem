import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, endWith, filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators';

import {
    enqueueSnackbar,
    GET_QR_CODE_FULFILLED,
    GET_QR_CODE_START,
    GetQRCodeFulfilled,
    getQRCodeFulfilled,
    getUserInfoStart,
    login,
} from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, customError, Dependencies, errHandler, USER } from 'Epics';

export const getQRCodeEpic: Epic<Action> = (action$) =>
    action$.pipe(
        ofType(GET_QR_CODE_START),
        mergeMap(() => ajax.getJSON(`${API}/user/login`)
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
                    enqueueSnackbar('请尽快用企业微信扫描二维码！', { variant: 'info' }),
                    { type: USER.SUCCESS },
                ),
                catchError((err) => errHandler(err, USER)),
            ),
        ),
    );

export const loginEpic: Epic<Action, Action, StoreState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(GET_QR_CODE_FULFILLED),
        filter((action: GetQRCodeFulfilled) => Boolean(action.key)),
        switchMap((action: GetQRCodeFulfilled) => ajax.getJSON(`${API}/user/${action.key}/status`).pipe(
            map((res: { token: string, type: string }) => {
                const { token, type } = res;
                if (type === 'success') {
                    return token;
                }
                throw customError(res);
            }),
            mergeMap((token) => of(
                login(token),
                getUserInfoStart(),
            )),
            endWith(
                { type: USER.SUCCESS },
                enqueueSnackbar('已成功登录！', { variant: 'success' }),
            ),
            catchError((err) => errHandler(err, USER, getQRCodeFulfilled(''))),
        )),
    );

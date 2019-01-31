import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, filter, mergeMap, startWith, switchMap } from 'rxjs/operators';

import {
    enqueueSnackbar,
    GET_QR_CODE_FULFILLED,
    GET_QR_CODE_START,
    GetQRCodeFulfilled,
    getQRCodeFulfilled,
    getUserInfoStart,
    login, toggleProgress,
} from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, customError, Dependencies, errHandler } from 'Epics';

export const getQRCodeEpic: Epic<Action> = (action$) =>
    action$.pipe(
        ofType(GET_QR_CODE_START),
        mergeMap(() => ajax.getJSON(`${API}/user/login`)
            .pipe(
                mergeMap((res: { type: string, key: string }) => {
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
    );

export const loginEpic: Epic<Action, Action, StoreState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(GET_QR_CODE_FULFILLED),
        filter(({ key }: GetQRCodeFulfilled) => !!key),
        switchMap((action: GetQRCodeFulfilled) => ajax.getJSON(`${API}/user/${action.key}/status`).pipe(
            mergeMap((res: { token: string, type: string }) => {
                const { token, type } = res;
                if (type === 'success') {
                    return of(
                        login(token),
                        getUserInfoStart(),
                        enqueueSnackbar('已成功登录！', { variant: 'success' }),
                        toggleProgress(),
                    );
                }
                throw customError(res);
            }),
            catchError((err) => errHandler(err, getQRCodeFulfilled(''))),
        )),
    );

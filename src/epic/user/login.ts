import { catchError, endWith, filter, map, mergeMap, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import {
    GET_QR_CODE,
    GetQRCode,
    login,
    Login,
    SET_KEY,
    SetKey,
    setKey,
    ToggleSnackbarOn,
    toggleSnackbarOn
} from '../../action';
import { URL } from '../../lib/const';
import { USER, UserAction } from './index';
import { customError } from '../index';


export const getQRCodeEpic: Epic<GetQRCode | ToggleSnackbarOn | SetKey | UserAction> = action$ =>
    action$.pipe(
        ofType(GET_QR_CODE),
        mergeMap(() => ajax.getJSON(`${URL}/user`)
            .pipe(
                map((res: any) => {
                    if (res.type === 'success') {
                        return setKey(res.key);
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: USER.START }
                ),
                endWith(
                    toggleSnackbarOn('请尽快用企业微信扫描二维码！', 'info'),
                    { type: USER.SUCCESS },
                ),
                catchError(err => of(
                    toggleSnackbarOn(`Error: ${err.message}`, err.type || 'danger'),
                    { type: USER.FAILURE }
                ))
            )
        ),
    );

export const loginEpic: Epic<SetKey | Login | ToggleSnackbarOn | UserAction> = action$ =>
    action$.pipe(
        ofType(SET_KEY),
        filter(action => action['key']),
        mergeMap(action => ajax.getJSON(`${URL}/user/${action['key']}/status`).pipe(
            map((res: any) => {
                const { uid, token, type } = res;
                if (type === 'success') {
                    sessionStorage.setItem('uid', uid);
                    sessionStorage.setItem('token', token);
                    return login(uid);
                }
                throw customError(res);
            }),
            endWith(
                toggleSnackbarOn('已成功登录！', 'success'),
            ),
            catchError(err => of(
                setKey(''),
                toggleSnackbarOn(`Error: ${err.message}`, err.type || 'danger'),
            ))
        ))
    );
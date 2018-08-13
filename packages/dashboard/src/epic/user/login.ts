import { catchError, endWith, filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import { concat, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { GET_QR_CODE, getUserInfo, login, SET_QR_CODE, SetQRCode, setQRCode, toggleSnackbarOn } from '../../action';
import { URL } from '../../lib/const';
import { USER, UserAction } from './index';
import { customError } from '../index';

export const getQRCodeEpic: Epic<UserAction> = action$ =>
    action$.pipe(
        ofType(GET_QR_CODE),
        mergeMap(() => ajax.getJSON(`${URL}/user`)
            .pipe(
                map((res: any) => {
                    if (res.type === 'success') {
                        return setQRCode(res.key);
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

export const loginEpic: Epic<UserAction> = action$ =>
    action$.pipe(
        ofType(SET_QR_CODE),
        filter((action: SetQRCode) => Boolean(action.key)),
        switchMap((action: SetQRCode) => ajax.getJSON(`${URL}/user/${action.key}/status`).pipe(
            mergeMap((res: any) => {
                const { uid, token, type } = res;
                if (type === 'success') {
                    sessionStorage.setItem('uid', uid);
                    sessionStorage.setItem('token', token);
                    return concat(
                        of(login(uid)),
                        of(getUserInfo(uid))
                    );
                }
                throw customError(res);
            }),
            endWith(
                toggleSnackbarOn('已成功登录！', 'success'),

            ),
            catchError(err => of(
                setQRCode(''),
                toggleSnackbarOn(`Error: ${err.message}`, err.type || 'danger'),
            ))
        ))
    );
import { catchError, endWith, filter, map, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';
import { concat, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { GET_QR_CODE, getUserInfo, login, SET_QR_CODE, SetQRCode, setQRCode, toggleSnackbarOn } from '../../action';
import { URL } from '../../lib/const';
import { Action, customError, Dependencies, errHandler, USER } from '../index';
import { StoreState } from '../../reducer';

export const getQRCodeEpic: Epic<Action> = action$ =>
    action$.pipe(
        ofType(GET_QR_CODE),
        mergeMap(() => ajax.getJSON(`${URL}/user`)
            .pipe(
                map((res: { type: string, key: string }) => {
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
                catchError(err => errHandler(err, USER))
            )
        ),
    );

export const loginEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage }) =>
    action$.pipe(
        ofType(SET_QR_CODE),
        filter((action: SetQRCode) => Boolean(action.key)),
        switchMap((action: SetQRCode) => ajax.getJSON(`${URL}/user/${action.key}/status`).pipe(
            map((res: { uid: string, token: string, type: string }) => {
                const { uid, token, type } = res;
                if (type === 'success') {
                    return { uid, token };
                }
                throw customError(res);
            }),
            tap(data => {
                sessionStorage.setItem('uid', data.uid);
                sessionStorage.setItem('token', data.token);
            }),
            mergeMap(data => concat(
                of(login(data.uid)),
                of(getUserInfo(data.uid))
            )),
            endWith(
                toggleSnackbarOn('已成功登录！', 'success'),
            ),
            catchError(err => of(
                setQRCode(''),
                toggleSnackbarOn(`Error: ${err.message}`, err.type || 'danger'),
            ))
        ))
    );
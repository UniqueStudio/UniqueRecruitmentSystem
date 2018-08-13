import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { USER, UserAction } from './index';
import { GET_GROUP_INFO, GetGroupInfo, setGroupInfo, toggleSnackbarOn } from '../../action';
import { URL } from '../../lib/const';
import { customError } from '../index';
import { StoreState } from '../../reducer';

export const getGroupEpic: Epic<UserAction, any, any, StoreState> = (action$, state$) =>
    action$.pipe(
        ofType(GET_GROUP_INFO),
        mergeMap((action: GetGroupInfo) => {
            const token = sessionStorage.getItem('token');
            const { group } = action;
            if (!token) {
                throw customError({ message: 'token不存在', type: 'danger' });
            }
            if (!group) {
                throw customError({ message: '请先完善个人信息！', type: 'danger' });
            }
            const groupInfo = sessionStorage.getItem('groupInfo');
            if (groupInfo && !state$.value.user.shouldUpdateGroup) {
                return of(
                    setGroupInfo(JSON.parse(groupInfo))
                );
            }
            return ajax.getJSON(`${URL}/user/group/${group}`, {
                'Authorization': `Bearer ${token}`
            })
                .pipe(
                    map((res: any) => {
                        if (res.type === 'success') {
                            sessionStorage.setItem('groupInfo', JSON.stringify(res.data));
                            return setGroupInfo(res.data);
                        }
                        throw customError(res);
                    }),
                    startWith(
                        { type: USER.START }
                    ),
                    endWith(
                        { type: USER.SUCCESS },
                    ),
                )
        }),
        catchError(err => of(
            toggleSnackbarOn(`Error: ${err.message}`, err.type || 'danger'),
            { type: USER.FAILURE }
        ))
    );

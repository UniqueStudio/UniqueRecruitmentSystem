import { catchError, endWith, map, mergeMap, startWith, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { Action, customError, Dependencies, errHandler, USER } from '../index';
import { GET_GROUP_INFO, GetGroupInfo, setGroupInfo } from '../../action';
import { URL, User } from '../../lib/const';
import { StoreState } from '../../reducer';

export const getGroupEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage }) =>
    action$.pipe(
        ofType(GET_GROUP_INFO),
        mergeMap((action: GetGroupInfo) => {
            const token = sessionStorage.getItem('token');
            const { group } = action;
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, USER);
            }
            if (!group) {
                return errHandler({ message: '请先完善个人信息', type: 'danger' }, USER);
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
                    map((res: { type: string, data: User[] }) => {
                        if (res.type === 'success') {
                            return res.data;
                        }
                        throw customError(res);
                    }),
                    tap(data => sessionStorage.setItem('groupInfo', JSON.stringify(data))),
                    map(data => setGroupInfo(data)),
                    startWith(
                        { type: USER.START }
                    ),
                    endWith(
                        { type: USER.SUCCESS },
                    ),
                    catchError(err => errHandler(err, USER)
                    ))
        })
    );

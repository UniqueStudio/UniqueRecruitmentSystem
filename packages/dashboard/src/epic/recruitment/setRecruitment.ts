import { Epic, ofType } from 'redux-observable';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';

import { Action, customError, Dependencies, errHandler, RECRUITMENT } from '../index';

import { SET_RECRUITMENT, SetRecruitment, setShouldUpdateRecruitment, toggleSnackbarOn } from '../../action';
import { StoreState } from '../../reducer';

import { URL } from '../../lib/const';

export const setRecruitmentEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { localStorage }) =>
    action$.pipe(
        ofType(SET_RECRUITMENT),
        mergeMap((action: SetRecruitment) => {
            const token = localStorage.getItem('token');
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, RECRUITMENT);
            }
            const { data } = action;
            return ajax.post(`${URL}/recruitment/${data['title']}`, JSON.stringify(data), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                map((response: AjaxResponse) => {
                    const res = response.response;
                    if (res.type === 'success') {
                        return setShouldUpdateRecruitment();
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: RECRUITMENT.START },
                ),
                endWith(
                    toggleSnackbarOn('已成功修改招新信息！', 'success'),
                    { type: RECRUITMENT.SUCCESS },
                ),
                catchError((err) => errHandler(err, RECRUITMENT)),
            );
        }),
    );

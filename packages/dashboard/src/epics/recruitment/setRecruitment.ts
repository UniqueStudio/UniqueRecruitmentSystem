import { Epic, ofType } from 'redux-observable';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, getRecruitmentsStart, SET_RECRUITMENT, SetRecruitment, setShouldUpdateRecruitment } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, checkToken, customError, Dependencies, errHandler, RECRUITMENT } from 'Epics';

export const setRecruitmentEpic: Epic<Action, Action, StoreState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(SET_RECRUITMENT),
        mergeMap((action: SetRecruitment) => {
            const token = checkToken();
            const { data } = action;
            return ajax.put(`${API}/recruitment/title/${data.title}`, JSON.stringify(data), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                map(({ response: res }: AjaxResponse) => {
                    if (res.type === 'success') {
                        return setShouldUpdateRecruitment();
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: RECRUITMENT.START },
                ),
                endWith(
                    enqueueSnackbar('已成功修改招新信息！', { variant: 'success' }),
                    getRecruitmentsStart(),
                    { type: RECRUITMENT.SUCCESS },
                ),
                catchError((err) => errHandler(err, RECRUITMENT)),
            );
        }),
        catchError((err) => errHandler(err, RECRUITMENT)),
    );

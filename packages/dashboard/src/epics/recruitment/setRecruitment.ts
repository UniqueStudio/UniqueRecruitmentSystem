import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, getRecruitmentsStart, SET_RECRUITMENT, SetRecruitment, setShouldUpdateRecruitment, toggleProgress } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, checkToken, customError, Dependencies, errHandler } from 'Epics';

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
                mergeMap(({ response: res }: AjaxResponse) => {
                    if (res.type === 'success') {
                        return of(
                            setShouldUpdateRecruitment(),
                            enqueueSnackbar('已成功修改招新信息！', { variant: 'success' }),
                            getRecruitmentsStart(),
                            toggleProgress(),
                        );
                    }
                    throw customError(res);
                }),
                startWith(toggleProgress(true)),
                catchError((err) => errHandler(err)),
            );
        }),
        catchError((err) => errHandler(err)),
    );

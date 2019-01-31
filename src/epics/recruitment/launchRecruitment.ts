import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, getRecruitmentsStart, LAUNCH_RECRUITMENT, LaunchRecruitment, setShouldUpdateRecruitment, toggleProgress } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, checkToken, customError, Dependencies, errHandler } from 'Epics';

export const launchRecruitmentsEpic: Epic<Action, Action, StoreState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(LAUNCH_RECRUITMENT),
        mergeMap((action: LaunchRecruitment) => {
            const token = checkToken();
            return ajax.post(`${API}/recruitment/`, JSON.stringify(action.info), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                mergeMap(({ response: res }: AjaxResponse) => {
                    if (res.type === 'success') {
                        return of(
                            setShouldUpdateRecruitment(),
                            enqueueSnackbar('已成功发起招新！', { variant: 'success' }),
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

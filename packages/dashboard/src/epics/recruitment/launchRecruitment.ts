import { Epic, ofType } from 'redux-observable';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, getRecruitmentsStart, LAUNCH_RECRUITMENT, LaunchRecruitment, setShouldUpdateRecruitment } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, checkToken, customError, Dependencies, errHandler, RECRUITMENT } from 'Epics';

export const launchRecruitmentsEpic: Epic<Action, Action, StoreState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(LAUNCH_RECRUITMENT),
        mergeMap((action: LaunchRecruitment) => {
            const token = checkToken();
            return ajax.post(`${API}/recruitment/`, JSON.stringify(action.info), {
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
                    enqueueSnackbar('已成功发起招新！', { variant: 'success' }),
                    getRecruitmentsStart(),
                    { type: RECRUITMENT.SUCCESS },
                ),
                catchError((err) => errHandler(err, RECRUITMENT)),
            );
        }),
        catchError((err) => errHandler(err, RECRUITMENT)),
    );

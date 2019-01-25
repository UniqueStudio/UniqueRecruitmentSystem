import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';

import { GET_RECRUITMENTS_START, getRecruitmentsFulfilled, setViewingRecruitmentFulfilled } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';
import { Recruitment } from 'Config/types';

import { Action, checkToken, customError, Dependencies, errHandler, RECRUITMENT } from 'Epics';

export const getRecruitmentsEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage }) =>
    action$.pipe(
        ofType(GET_RECRUITMENTS_START),
        mergeMap(() => {
            const token = checkToken();
            const recruitments = sessionStorage.getItem('recruitments');
            const viewing = sessionStorage.getItem('viewing');
            if (recruitments && !state$.value.recruitment.shouldUpdateRecruitment) {
                return of(
                    getRecruitmentsFulfilled(JSON.parse(recruitments)),
                );
            }
            return ajax.getJSON(`${API}/recruitment/`, {
                Authorization: `Bearer ${token}`,
            }).pipe(
                map((res: { type: string, data: Recruitment[] }) => {
                    if (res.type === 'success') {
                        return res.data;
                    }
                    throw customError(res);
                }),
                mergeMap((data) => of(
                    getRecruitmentsFulfilled(data),
                    setViewingRecruitmentFulfilled(viewing ? viewing : data.slice(-1)[0] ? data.slice(-1)[0].title : ''),
                )),
                startWith(
                    { type: RECRUITMENT.START },
                ),
                endWith(
                    { type: RECRUITMENT.SUCCESS },
                ),
                catchError((err) => errHandler(err, RECRUITMENT)),
            );
        }),
        catchError((err) => errHandler(err, RECRUITMENT)),
    );

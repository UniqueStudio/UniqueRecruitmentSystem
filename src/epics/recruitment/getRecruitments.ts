import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import {
    GET_RECRUITMENTS_START,
    getRecruitmentsFulfilled,
    setViewingRecruitmentFulfilled,
    toggleProgress
} from '../../actions';

import { API } from '../../config/consts';
import { Recruitment } from '../../config/types';

import { checkToken, customError, Epic, errHandler } from '../';

export const getRecruitmentsEpic: Epic = (action$, state$, { sessionStorage }) =>
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
            return ajax.getJSON<{ type: string, data: Recruitment[] }>(`${API}/recruitment/`, {
                Authorization: `Bearer ${token}`,
            }).pipe(
                mergeMap((res) => {
                    if (res.type === 'success') {
                        const data = res.data;
                        const newViewing = viewing ? viewing : data.slice(-1)[0] ? data.slice(-1)[0].title : '';
                        return of(
                            getRecruitmentsFulfilled(data),
                            setViewingRecruitmentFulfilled(newViewing),
                            toggleProgress()
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

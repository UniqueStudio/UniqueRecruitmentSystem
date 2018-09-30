import { catchError, endWith, map, mergeMap, startWith, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { Action, customError, Dependencies, errHandler, RECRUITMENT } from '../index';
import { GET_RECRUITMENTS_START, getRecruitmentsFulfilled } from '../../action';
import { Recruitment, URL } from '../../lib/const';
import { StoreState } from '../../reducer';

export const getRecruitmentsEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage, localStorage }) =>
    action$.pipe(
        ofType(GET_RECRUITMENTS_START),
        mergeMap(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, RECRUITMENT);
            }
            const recruitments = sessionStorage.getItem('historyRecruitments');
            if (recruitments && !state$.value.recruitments.shouldUpdateRecruitment) {
                return of(
                    getRecruitmentsFulfilled(JSON.parse(recruitments))
                );
            }
            return ajax.getJSON(`${URL}/recruitment`, {
                'Authorization': `Bearer ${token}`,
            }).pipe(
                map((res: { type: string, data: Recruitment[] }) => {
                    if (res.type === 'success') {
                        return res.data;
                    }
                    throw customError(res);
                }),
                tap(data => sessionStorage.setItem('historyRecruitments', JSON.stringify(data))),
                map(data => getRecruitmentsFulfilled(data)),
                startWith(
                    { type: RECRUITMENT.START }
                ),
                endWith(
                    { type: RECRUITMENT.SUCCESS },
                ),
                catchError(err => errHandler(err, RECRUITMENT))
            )
        }),
    );

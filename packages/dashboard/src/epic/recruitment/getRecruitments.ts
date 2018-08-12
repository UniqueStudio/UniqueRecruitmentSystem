import { catchError, endWith, map, mergeMap, startWith, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { Action, customError, Dependencies, errHandler, RECRUITMENT } from '../index';
import { GET_RECRUITMENTS, setRecruitments } from '../../action';
import { URL } from '../../lib/const';
import { StoreState } from '../../reducer';

export const getRecruitmentsEpic: Epic<Action, any, StoreState, Dependencies> = (action$, state$, { sessionStorage }) =>
    action$.pipe(
        ofType(GET_RECRUITMENTS),
        mergeMap(() => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, RECRUITMENT);
            }
            const recruitments = sessionStorage.getItem('historyRecruitments');
            if (recruitments && !state$.value.recruitments.shouldUpdateRecruitment) {
                return of(
                    setRecruitments(JSON.parse(recruitments))
                );
            }
            return ajax.getJSON(`${URL}/recruitment`, {
                'Authorization': `Bearer ${token}`,
            }).pipe(
                map((res: any) => {
                    if (res.type === 'success') {
                        return res.data;
                    }
                    throw customError(res);
                }),
                tap(data => sessionStorage.setItem('historyRecruitments', JSON.stringify(data))),
                map(data => setRecruitments(data)),
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

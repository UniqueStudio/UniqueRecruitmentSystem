import { catchError, endWith, map, mergeMap, startWith, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { Action, CANDIDATE, customError, Dependencies, errHandler } from '../index';
import { GET_CANDIDATES, GetCandidates, setCandidates, setGroup } from '../../action';
import { PENDING_RECRUITMENT, URL } from '../../lib/const';
import { StoreState } from '../../reducer';

export const getCandidatesEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage, localStorage }) =>
    action$.pipe(
        ofType(GET_CANDIDATES),
        mergeMap((action: GetCandidates) => {
            const token = localStorage.getItem('token');
            const { group } = action;
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, CANDIDATE);
            }
            if (!group) {
                return errHandler({ message: '请先完善个人信息', type: 'danger' }, CANDIDATE);
            }
            const candidates = sessionStorage.getItem(group);
            if (candidates && !state$.value.candidates.shouldUpdateCandidates) {
                return of(
                    setGroup(group),
                    setCandidates(JSON.parse(candidates))
                );
            }
            return ajax.getJSON(`${URL}/candidates/group/${group}/recruitment/${PENDING_RECRUITMENT}`, {
                'Authorization': `Bearer ${token}`,
            }).pipe(
                map((res: { type: string, data: object[] }) => {
                    if (res.type === 'success') {
                        return res.data;
                    }
                    throw customError(res);
                }),
                tap(data => sessionStorage.setItem(group, JSON.stringify(data))),
                map(data => setCandidates(data)),
                startWith(
                    { type: CANDIDATE.START }
                ),
                endWith(
                    setGroup(group),
                    { type: CANDIDATE.SUCCESS },
                ),
                catchError(err => errHandler(err, CANDIDATE))
            )
        }),
    );

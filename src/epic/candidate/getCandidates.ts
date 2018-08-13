import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { Epic, ofType } from "redux-observable";
import { CANDIDATE, CandidateAction } from './index';
import { GET_CANDIDATES, GetCandidates, setCandidates, setGroup, toggleSnackbarOn } from '../../action';
import { URL } from '../../lib/const';
import { customError } from '../index';
import { StoreState } from '../../reducer';

export const getCandidatesEpic: Epic<CandidateAction, any, any, StoreState> = (action$, state$) =>
    action$.pipe(
        ofType(GET_CANDIDATES),
        mergeMap((action: GetCandidates) => {
            const token = sessionStorage.getItem('token');
            const { group } = action;
            if (!token) {
                throw customError({ message: 'token不存在', type: 'danger' });
            }
            if (!group) {
                throw customError({ message: '请先完善个人信息！', type: 'danger' });
            }
            const candidates = sessionStorage.getItem(group);
            if (candidates && !state$.value.candidates.shouldUpdateCandidates) {
                return of(
                    setGroup(group),
                    setCandidates(JSON.parse(candidates))
                );
            }
            return ajax.getJSON(`${URL}/candidates/group/${group}`, {
                'Authorization': `Bearer ${token}`,
            }).pipe(
                map((res: any) => {
                    if (res.type === 'success') {
                        sessionStorage.setItem(group, JSON.stringify(res.data));
                        return setCandidates(res.data);
                    }
                    throw customError(res);
                }),
                startWith(
                    { type: CANDIDATE.START }
                ),
                endWith(
                    setGroup(group),
                    { type: CANDIDATE.SUCCESS },
                ),
            )
        }),
        catchError(err => of(
            toggleSnackbarOn(`Error: ${err.message}`, err.type || 'danger'),
            { type: CANDIDATE.FAILURE }
        ))
    );

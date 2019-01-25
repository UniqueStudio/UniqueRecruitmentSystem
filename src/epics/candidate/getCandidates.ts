import { Candidate } from 'Config/types';
import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, endWith, map, mergeMap, startWith } from 'rxjs/operators';

import { GET_CANDIDATES_START, getCandidatesFulfilled, GetCandidatesStart } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, CANDIDATE, checkToken, customError, Dependencies, errHandler } from 'Epics';

export const getCandidatesEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage }) =>
    action$.pipe(
        ofType(GET_CANDIDATES_START),
        mergeMap((action: GetCandidatesStart) => {
            const token = checkToken();
            const { title, step, group } = action;
            const candidates = sessionStorage.getItem('candidates');
            const viewing = sessionStorage.getItem('viewing');
            if (candidates && title === viewing) {
                let data = JSON.parse(candidates);
                if (step) data = data.filter((candidate: Candidate) => candidate.step === step);
                if (group) data = data.filter((candidate: Candidate) => candidate.group === group);
                return of(
                    getCandidatesFulfilled(data),
                );
            }
            return ajax.getJSON(`${API}/candidate/${JSON.stringify({ title, step, group })}`, {
                Authorization: `Bearer ${token}`,
            }).pipe(
                map((res: { type: string, data: Candidate[] }) => {
                    if (res.type === 'success') {
                        const old = JSON.parse(candidates || '[]') as Candidate[];
                        res.data.forEach((newInfo) => {
                            const index = old.findIndex((oldInfo) => oldInfo._id === newInfo._id);
                            if (index === -1) {
                                old.push(newInfo);
                            } else {
                                old[index] = newInfo;
                            }
                        });
                        return old;
                    }
                    throw customError(res);
                }),
                map((data) => getCandidatesFulfilled(data)),
                startWith(
                    { type: CANDIDATE.START },
                ),
                endWith(
                    { type: CANDIDATE.SUCCESS },
                ),
                catchError((err) => errHandler(err, CANDIDATE)),
            );
        }),
        catchError((err) => errHandler(err, CANDIDATE))
    );

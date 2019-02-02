import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { GET_CANDIDATES_START, getCandidatesFulfilled, GetCandidatesStart, toggleProgress } from '../../actions';

import { API } from '../../config/consts';
import { Candidate } from '../../config/types';

import { checkToken, customError, Epic, errHandler } from '../';

export const getCandidatesEpic: Epic<GetCandidatesStart> = (action$, state$, { sessionStorage }) =>
    action$.pipe(
        ofType(GET_CANDIDATES_START),
        mergeMap((action) => {
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
            return ajax.getJSON<{ type: string, data: Candidate[] }>(
                `${API}/candidate/${JSON.stringify({ title, step, group })}`,
                {
                    Authorization: `Bearer ${token}`,
                }
            ).pipe(
                mergeMap((res) => {
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
                        return of(
                            getCandidatesFulfilled(old),
                            toggleProgress()
                        );
                    }
                    throw customError(res);
                }),
                startWith(toggleProgress(true)),
                catchError((err) => errHandler(err)),
            );
        }),
        catchError((err) => errHandler(err))
    );

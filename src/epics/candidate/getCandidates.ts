import { ofType } from 'redux-observable';
import { merge, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, filter, map, mergeMap, startWith } from 'rxjs/operators';

import {
    enqueueSnackbar,
    getCandidatesFulfilled,
    GetCandidatesStart,
    GET_CANDIDATES_START,
    setViewingRecruitmentFulfilled,
    toggleFabOff,
    toggleProgress,
} from '../../actions';

import { API } from '../../config/consts';
import { Candidate } from '../../config/types';

import { checkToken, customError, Epic, errHandler } from '../';

export const getCandidatesEpic: Epic<GetCandidatesStart> = (action$, state$, { localStorage }) => {
    const start$ = action$.pipe(ofType(GET_CANDIDATES_START));
    const fromCache$ = start$.pipe(
        map((action) => ({
            ...action,
            candidates: localStorage.getItem('candidates'),
            viewing: localStorage.getItem('viewing'),
        })),
        filter(({ candidates, viewing, title }) => candidates !== null && title === viewing),
        mergeMap(({ step, group, candidates }) => {
            let data = candidates!;
            if (step) data = data.filter((candidate) => candidate.step === step);
            if (group) data = data.filter((candidate) => candidate.group === group);
            return of(
                getCandidatesFulfilled(data),
                toggleFabOff(),
                enqueueSnackbar('成功获取候选人信息（缓存）', { variant: 'success' }),
            );
        }),
    );
    const fromAjax$ = start$.pipe(
        mergeMap(({ title, step, group }) =>
            ajax
                .getJSON<{ type: string; data: Candidate[] }>(
                    `${API}/candidate/${JSON.stringify({ title, step, group })}`,
                    {
                        Authorization: `Bearer ${checkToken()}`,
                    },
                )
                .pipe(
                    mergeMap((res) => {
                        if (res.type === 'success') {
                            return of(
                                getCandidatesFulfilled(res.data),
                                setViewingRecruitmentFulfilled(title),
                                toggleFabOff(),
                                enqueueSnackbar('成功获取候选人信息（线上）', { variant: 'success' }),
                                toggleProgress(),
                            );
                        }
                        throw customError(res);
                    }),
                    startWith(toggleProgress(true)),
                    catchError((err) => errHandler(err)),
                ),
        ),
    );
    return merge(fromCache$, fromAjax$);
};

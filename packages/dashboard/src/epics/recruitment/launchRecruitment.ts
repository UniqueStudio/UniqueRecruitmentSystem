import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import {
    enqueueSnackbar,
    getRecruitmentsStart,
    LaunchRecruitment,
    LAUNCH_RECRUITMENT,
    setShouldUpdateRecruitment,
    toggleProgress,
} from '../../actions';

import { API } from '../../config/consts';

import { checkToken, customError, Epic, errHandler } from '../';

export const launchRecruitmentsEpic: Epic<LaunchRecruitment> = (action$) =>
    action$.pipe(
        ofType(LAUNCH_RECRUITMENT),
        mergeMap(({ info }) => {
            const token = checkToken();
            return ajax
                .post(`${API}/recruitment/`, JSON.stringify(info), {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                })
                .pipe(
                    mergeMap(({ response: res }) => {
                        if (res.type === 'success') {
                            return of(
                                setShouldUpdateRecruitment(),
                                enqueueSnackbar('已成功发起招新！', { variant: 'success' }),
                                getRecruitmentsStart(),
                                toggleProgress(),
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

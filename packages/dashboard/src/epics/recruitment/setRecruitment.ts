import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { enqueueSnackbar, getRecruitmentsStart, SET_RECRUITMENT, SetRecruitment, setShouldUpdateRecruitment, toggleProgress } from '../../actions';

import { API } from '../../config/consts';

import { checkToken, customError, Epic, errHandler } from '../';

export const setRecruitmentEpic: Epic<SetRecruitment> = (action$) =>
    action$.pipe(
        ofType(SET_RECRUITMENT),
        mergeMap(({ data }) => {
            const token = checkToken();
            return ajax.put(`${API}/recruitment/title/${data.title}`, JSON.stringify(data), {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }).pipe(
                mergeMap(({ response: res }) => {
                    if (res.type === 'success') {
                        return of(
                            setShouldUpdateRecruitment(),
                            enqueueSnackbar('已成功修改招新信息！', { variant: 'success' }),
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

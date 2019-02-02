import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { enqueueSnackbar, SET_VIEWING_RECRUITMENT_START, setViewingRecruitmentFulfilled, SetViewingRecruitmentStart } from '../../actions';

import { Epic } from '../';

export const setViewingEpic: Epic<SetViewingRecruitmentStart> = (action$, state$) =>
    action$.pipe(
        ofType(SET_VIEWING_RECRUITMENT_START),
        mergeMap(({ title }) => {
            const joinTime = state$.value.user.info.joinTime;
            if (joinTime && joinTime !== title) {
                return of(
                    setViewingRecruitmentFulfilled(title),
                    enqueueSnackbar('设置成功！', { variant: 'success' })
                );
            }
            return of(
                enqueueSnackbar('你不能查看本次招新！', { variant: 'info' })
            );
        }),
    );

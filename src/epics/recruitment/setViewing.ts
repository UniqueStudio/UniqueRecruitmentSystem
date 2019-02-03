import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import {
    enqueueSnackbar,
    getCandidatesStart,
    SET_VIEWING_RECRUITMENT_START,
    SetViewingRecruitmentStart
} from '../../actions';

import { Epic } from '../';

export const setViewingEpic: Epic<SetViewingRecruitmentStart> = (action$, state$) =>
    action$.pipe(
        ofType(SET_VIEWING_RECRUITMENT_START),
        mergeMap(({ title }) => {
            const joinTime = state$.value.user.info.joinTime;
            if (joinTime && joinTime !== title) {
                return of(
                    getCandidatesStart(title),
                    enqueueSnackbar('设置成功！', { variant: 'success' }),
                );
            }
            return of(
                enqueueSnackbar('你不能查看本次招新！', { variant: 'info' })
            );
        }),
    );

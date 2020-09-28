import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import {
    enqueueSnackbar,
    getCandidatesStart,
    SetViewingRecruitmentStart,
    SET_VIEWING_RECRUITMENT_START,
} from '../../actions';

import { Epic } from '../';
import { compareTitle } from '../../utils/compareTitle';

export const setViewingEpic: Epic<SetViewingRecruitmentStart> = (action$, state$) =>
    action$.pipe(
        ofType(SET_VIEWING_RECRUITMENT_START),
        mergeMap(({ title }) => {
            const {
                info: { joinTime },
            } = state$.value.user;
            const { viewing } = state$.value.recruitment;
            if (compareTitle(joinTime, title) >= 0) {
                return of(enqueueSnackbar('你不能查看本次招新！', { variant: 'info' }));
            }
            if (viewing === title) {
                return of(enqueueSnackbar('设置成功', { variant: 'success' }));
            }
            return of(
                getCandidatesStart(title),
                enqueueSnackbar('设置成功，正在获取候选人信息', { variant: 'success' }),
            );
        }),
    );

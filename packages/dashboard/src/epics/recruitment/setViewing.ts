import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { enqueueSnackbar, SET_VIEWING_RECRUITMENT_START, setViewingRecruitmentFulfilled, SetViewingRecruitmentStart } from '../../actions';

import { Epic } from '../';

export const setViewingEpic: Epic<SetViewingRecruitmentStart> = (action$) =>
    action$.pipe(
        ofType(SET_VIEWING_RECRUITMENT_START),
        mergeMap(({ title }) => of(
            setViewingRecruitmentFulfilled(title),
            enqueueSnackbar('设置成功！', { variant: 'success' })
        )),
    );

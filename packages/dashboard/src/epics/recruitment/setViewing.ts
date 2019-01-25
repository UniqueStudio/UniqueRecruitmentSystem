import { Epic, ofType } from 'redux-observable';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { enqueueSnackbar, SET_VIEWING_RECRUITMENT_START, setViewingRecruitmentFulfilled, SetViewingRecruitmentStart } from 'Actions';
import { StoreState } from 'Reducers';

import { Action, Dependencies } from 'Epics';

export const setViewingEpic: Epic<Action, Action, StoreState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(SET_VIEWING_RECRUITMENT_START),
        mergeMap((action: SetViewingRecruitmentStart) => of(
            setViewingRecruitmentFulfilled(action.title),
            enqueueSnackbar('设置成功！', { variant: 'success' })
        )),
    );

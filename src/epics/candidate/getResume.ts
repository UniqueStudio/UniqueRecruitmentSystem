import { Epic, ofType } from 'redux-observable';
import { from } from 'rxjs';
import { catchError, map, mergeMap, startWith } from 'rxjs/operators';

import { GET_RESUME, GetResume, toggleProgress } from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';

import { Action, checkToken, customError, Dependencies, errHandler } from 'Epics';

const downloadResume = (res: Response) => {
    if (!res.ok) {
        if (res.status === 404) {
            throw customError({ message: '简历不存在', type: 'info' });
        }
        return from(res.json()).pipe(
            map((err) => {
                throw customError(err);
            }),
        );
    }
    let filename = 'resume';
    return from(res.blob()).pipe(
        map((blob: Blob) => {
            const disposition = res.headers.get('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches !== null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                    filename = Buffer.from(filename, 'base64').toString();
                }
            }
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            return toggleProgress();
        }),
    );
};

export const getResumeEpic: Epic<Action, Action, StoreState, Dependencies> = (action$) =>
    action$.pipe(
        ofType(GET_RESUME),
        mergeMap((action: GetResume) => {
            const token = checkToken();
            const { cid } = action;
            return from(fetch(`${API}/candidate/${cid}/resume`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })).pipe(
                mergeMap(downloadResume),
                startWith(toggleProgress(true)),
                catchError((err) => errHandler(err)),
            );
        }),
        catchError((err) => errHandler(err)),
    );

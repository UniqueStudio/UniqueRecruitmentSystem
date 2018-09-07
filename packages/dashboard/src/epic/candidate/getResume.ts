import { catchError, map, mergeMap, startWith } from 'rxjs/operators';
import { from } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import { Action, CANDIDATE, customError, Dependencies, errHandler } from '../index';
import { GET_RESUME, GetResume } from '../../action';
import { URL } from '../../lib/const';
import { StoreState } from '../../reducer';

const downloadResume = (res: Response) => {
    if (!res.ok) {
        if (res.status == 404) {
            throw customError({ message: '简历不存在', type: 'info' })
        }
        return from(res.json()).pipe(
            map(err => {
                throw customError(err)
            })
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
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            return { type: CANDIDATE.SUCCESS };
        })
    );
};

export const getResumeEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { sessionStorage }) =>
    action$.pipe(
        ofType(GET_RESUME),
        mergeMap((action: GetResume) => {
            const token = sessionStorage.getItem('token');
            const { cid } = action;
            if (!token) {
                return errHandler({ message: 'token不存在', type: 'danger' }, CANDIDATE)
            }
            return from(fetch(`${URL}/candidates/${cid}/resume`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })).pipe(
                mergeMap(downloadResume),
                catchError(err => errHandler(err, CANDIDATE)),
                startWith(
                    { type: CANDIDATE.START }
                ),
            )
        }),
    );

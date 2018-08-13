import { catchError, map, mergeMap, startWith } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import { CANDIDATE, CandidateAction } from './index';
import { GET_RESUME, GetResume, toggleSnackbarOn } from '../../action';
import { URL } from '../../lib/const';
import { customError } from '../index';

const downloadResume = (res: Response) => {
    if (!res.ok) {
        throw from(res.json()).pipe(
            map(err => customError(err))
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

export const getResumeEpic: Epic<CandidateAction> = action$ =>
    action$.pipe(
        ofType(GET_RESUME),
        mergeMap((action: GetResume) => {
            const token = sessionStorage.getItem('token');
            const { cid } = action;
            if (!token) {
                throw customError({ message: 'token不存在', type: 'danger' });
            }
            return from(fetch(`${URL}/candidates/${cid}/resume`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })).pipe(
                mergeMap(downloadResume),
                startWith(
                    { type: CANDIDATE.START }
                ),
            )
        }),
        catchError(err => of(
            toggleSnackbarOn(`Error: ${err.message}`, err.type || 'danger'),
            { type: CANDIDATE.FAILURE }
        ))
    );

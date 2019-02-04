import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { GET_RESUME, GetResume, toggleProgress } from '../../actions';

import { API } from '../../config/consts';

import { checkToken, customError, Epic, errHandler } from '../';

const download = async (res: Response) => {
    if (!res.ok) {
        if (res.status === 404) {
            throw customError({ message: '简历不存在', type: 'info' });
        }
        throw customError(await res.json());
    }
    const total = res.headers.get('Content-Length');
    const disposition = res.headers.get('Content-Disposition');
    if (!total) {
        throw new Error('Can\'t get content-length');
    }
    let loaded = 0;
    const response = new Response(new ReadableStream({
        async start(controller) {
            const reader = res.body!.getReader();
            let result = await reader.read();
            while (!result.done) {
                const value = result.value;
                loaded += value.byteLength;
                console.log(loaded / +total);
                controller.enqueue(value);
                result = await reader.read();
            }
            controller.close();
        }
    }));
    let filename = 'resume';
    const blob = await response.blob();
    if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches !== null && matches[1]) {
            filename = Buffer.from(matches[1].replace(/['"]/g, ''), 'base64').toString();
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
};

export const getResumeEpic: Epic<GetResume> = (action$) =>
    action$.pipe(
        ofType(GET_RESUME),
        mergeMap((action) => {
            const token = checkToken();
            const { cid } = action;
            return from(fetch(`${API}/candidate/${cid}/resume`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })).pipe(
                mergeMap(download),
                startWith(toggleProgress(true)),
                catchError((err) => errHandler(err)),
            );
        }),
        catchError((err) => errHandler(err)),
    );

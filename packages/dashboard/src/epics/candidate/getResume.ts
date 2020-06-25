import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { catchError, mergeMap, startWith } from 'rxjs/operators';

import { GetResume, GET_RESUME, resumeProgress, toggleProgress } from '../../actions';

import { API } from '../../config/consts';

import { checkToken, customError, Epic, errHandler } from '../';
import { store } from '../../App';

const download = (cid: string) => async (res: Response) => {
    if (!res.ok) {
        if (res.status === 404) {
            throw customError({ message: '简历不存在', type: 'info' });
        }
        throw customError(await res.json());
    }
    const total = res.headers.get('Content-Length');
    const disposition = res.headers.get('Content-Disposition');
    const reader = res.body?.getReader();
    if (!total) {
        throw customError({ message: 'Can\'t get Content-Length', type: 'error' });
    }
    if (!reader) {
        throw customError({ message: 'Can\'t get reader', type: 'error' });
    }
    let loaded = 0;
    const stream = new ReadableStream({
        async start(controller: ReadableStreamDefaultController) {
            while (true) {
                const { done, value } = await reader.read();
                if (done || !value) {
                    break;
                }
                loaded += value.byteLength;
                store.dispatch(resumeProgress(loaded / +total, cid));
                controller.enqueue(value);
            }
            controller.close();
        }
    });
    let filename = 'resume';
    if (disposition && disposition.includes('attachment')) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches && matches[1]) {
            filename = Buffer.from(matches[1].replace(/['"]/g, ''), 'base64').toString();
        }
    }
    const blob = await new Response(stream).blob();
    const url = URL.createObjectURL(new Blob([blob]));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    store.dispatch(resumeProgress(0, ''));
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
                mergeMap(download(cid)),
                startWith(toggleProgress(true)),
                catchError((err) => errHandler(err)),
            );
        }),
        catchError((err) => errHandler(err)),
    );

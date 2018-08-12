import { ignoreElements, startWith, switchMap, tap } from 'rxjs/operators';
import { EMPTY, Observable, Subscriber } from 'rxjs';
import { Epic, ofType } from "redux-observable";
import {
    addCandidate,
    addCommentFulfilled,
    addImage,
    addMessage,
    moveCandidateFulfilled,
    removeCandidateFulfilled,
    removeCommentFulfilled,
    setShouldUpdateRecruitment,
    toggleSnackbarOn
} from '../action';
import { Action, CANDIDATE, COMMENT, Dependencies, RECRUITMENT, USER } from './index';
import { StoreState } from '../reducer';
import { Comment, URL } from '../lib/const';

export const socketConnectEpic: Epic<Action, any, StoreState, Dependencies> = (action$, state$, { io, socket$ }) =>
    action$.pipe(
        ofType('SOCKET_START'),
        switchMap(() =>
            new Observable((o: Subscriber<any>) => {
                const socket = io(URL);
                socket.on('connect', () => o.next(socket));
                socket.on('disconnect', () => o.next(null));
                return () => {
                    socket.close();
                };
            })),
        tap(socket$),
        ignoreElements(),
        startWith({ type: 'SOCKET_START' })
    );

export const socketReceiveEpic: Epic<Action, any, StoreState, Dependencies> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket: any) => socket == null ? EMPTY :
            new Observable(o => {
                socket.on('removeCandidate', (cid: string) => {
                    o.next({ type: CANDIDATE.START });
                    o.next(removeCandidateFulfilled(cid));
                    o.next(toggleSnackbarOn('有候选人被移除了！', 'info'));
                    o.next({ type: CANDIDATE.SUCCESS });
                });
                socket.on('removeCandidateError', (message: string, color: string) => {
                    o.next(toggleSnackbarOn(`ERROR: ${message}`, color || 'danger'));
                    o.next({ type: CANDIDATE.FAILURE });
                });

                socket.on('moveCandidate', (cid: string, from: number, to: number) => {
                    o.next({ type: CANDIDATE.START });
                    o.next(moveCandidateFulfilled(from, to, cid));
                    o.next(toggleSnackbarOn('有候选人被移动了！', 'info'));
                    o.next({ type: CANDIDATE.SUCCESS });
                });
                socket.on('moveCandidateSuccess', () => {
                    o.next({ type: CANDIDATE.SUCCESS });
                });
                socket.on('moveCandidateError', (message: string, color: string, data: { to: number, from: number, cid: string }) => {
                    o.next(moveCandidateFulfilled(data.to, data.from, data.cid));
                    o.next(toggleSnackbarOn(`ERROR: ${message}`, color || 'danger'));
                    o.next({ type: CANDIDATE.FAILURE });
                });

                socket.on('addComment', (step: number, cid: string, commenter: string, comment: Comment) => {
                    o.next({ type: COMMENT.START });
                    o.next(addCommentFulfilled(step, cid, commenter, comment));
                    o.next({ type: COMMENT.SUCCESS });
                });
                socket.on('addCommentError', (message: string, color: string) => {
                    o.next(toggleSnackbarOn(`ERROR: ${message}`, color || 'danger'));
                    o.next({ type: COMMENT.FAILURE });
                });

                socket.on('removeComment', (step: number, cid: string, commenter: string) => {
                    o.next({ type: COMMENT.START });
                    o.next(removeCommentFulfilled(step, cid, commenter));
                    o.next({ type: COMMENT.SUCCESS });
                });
                socket.on('removeCommentError', (message: string, color: string) => {
                    o.next(toggleSnackbarOn(`ERROR: ${message}`, color || 'danger'));
                    o.next({ type: COMMENT.FAILURE });
                });
                socket.on('addCandidate', (candidate: object) => {
                    o.next({ type: CANDIDATE.START });
                    o.next(addCandidate(candidate));
                    o.next(toggleSnackbarOn(`${candidate['group']}组多了一名报名选手！`, 'info'));
                    o.next({ type: CANDIDATE.SUCCESS });
                });

                socket.on('updateRecruitment', () => {
                    o.next({ type: RECRUITMENT.START });
                    o.next(setShouldUpdateRecruitment());
                    o.next({ type: RECRUITMENT.SUCCESS });
                });

                socket.on('receiveMessage', (name: string, avatar: string, time: number, message: string) => {
                    o.next({ type: USER.START });
                    o.next(addMessage(name, avatar, time, message, false));
                    o.next({ type: USER.SUCCESS });
                });

                socket.on('receiveImage', (name: string, avatar: string, time: number, image: string) => {
                    o.next({ type: USER.START });
                    o.next(addImage(name, avatar, time, image, false));
                    o.next({ type: USER.SUCCESS });
                });
            })));

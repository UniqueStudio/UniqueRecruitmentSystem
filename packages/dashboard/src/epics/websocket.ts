import { Epic, ofType } from 'redux-observable';
import { EMPTY, Observable, Subscriber } from 'rxjs';
import { ignoreElements, switchMap, tap } from 'rxjs/operators';

import { VariantType } from 'notistack';

import {
    addCandidateFulfilled,
    addCommentFulfilled,
    addMessage,
    enqueueSnackbar,
    moveCandidateFulfilled,
    removeCandidateFulfilled,
    removeCommentFulfilled,
    setShouldUpdateRecruitment,
} from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';
import { Candidate, Comment, Group, Message, Step } from 'Config/types';

import { Action, CANDIDATE, COMMENT, Dependencies, RECRUITMENT, Socket, USER } from 'Epics';

const socketConnectEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { io, socket$ }) =>
    action$.pipe(
        ofType('SOCKET_START'),
        switchMap(() =>
            new Observable((o: Subscriber<Socket>) => {
                const socket: Socket = io(API);
                socket.on('connect', () => o.next(socket));
                socket.on('disconnect', () => o.complete());
                return () => {
                    socket.close();
                };
            }),
        ),
        tap(socket$),
        ignoreElements(),
    );

const socketReceiveEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket: Socket) => !socket ? EMPTY :
            new Observable((o) => {
                socket.on('removeCandidate', ({ cid }: { cid: string }) => {
                    o.next({ type: CANDIDATE.START });
                    o.next(removeCandidateFulfilled(cid));
                    o.next(setShouldUpdateRecruitment());
                    o.next(enqueueSnackbar('有候选人被移除了！', { variant: 'info' }));
                    o.next({ type: CANDIDATE.SUCCESS });
                });
                socket.on('removeCandidateError', (res: { message: string, type: VariantType }) => {
                    const { message, type } = res;
                    o.next(enqueueSnackbar(`ERROR: ${message}`, { variant: type || 'error' }));
                    o.next({ type: CANDIDATE.FAILURE });
                });

                socket.on('moveCandidate', (res: { cid: string, from: Step, to: Step }) => {
                    const { cid, from, to } = res;
                    o.next({ type: CANDIDATE.START });
                    o.next(moveCandidateFulfilled(from, to, cid));
                    o.next(setShouldUpdateRecruitment());
                    o.next(enqueueSnackbar('有候选人被移动了！', { variant: 'info' }));
                    o.next({ type: CANDIDATE.SUCCESS });
                });
                socket.on('moveCandidateSuccess', () => {
                    o.next(setShouldUpdateRecruitment());
                    o.next({ type: CANDIDATE.SUCCESS });
                });
                socket.on('moveCandidateError', (res: { message: string, type: VariantType, data: { to: Step, from: Step, cid: string } }) => {
                    const { message, type, data } = res;
                    o.next(moveCandidateFulfilled(data.to, data.from, data.cid));
                    o.next(enqueueSnackbar(`ERROR: ${message}`, { variant: type || 'error' }));
                    o.next({ type: CANDIDATE.FAILURE });
                });

                socket.on('addComment', (res: { cid: string, comment: Comment }) => {
                    const { cid, comment } = res;
                    o.next({ type: COMMENT.START });
                    o.next(addCommentFulfilled(cid, comment));
                    o.next({ type: COMMENT.SUCCESS });
                });
                socket.on('addCommentError', (res: { message: string, type: VariantType }) => {
                    const { message, type } = res;
                    o.next(enqueueSnackbar(`ERROR: ${message}`, { variant: type || 'error' }));
                    o.next({ type: COMMENT.FAILURE });
                });

                socket.on('removeComment', (res: { cid: string, id: string }) => {
                    const { cid, id } = res;
                    o.next({ type: COMMENT.START });
                    o.next(removeCommentFulfilled(cid, id));
                    o.next({ type: COMMENT.SUCCESS });
                });
                socket.on('removeCommentError', (res: { message: string, type: VariantType }) => {
                    const { message, type } = res;
                    o.next(enqueueSnackbar(`ERROR: ${message}`, { variant: type || 'error' }));
                    o.next({ type: COMMENT.FAILURE });
                });

                socket.on('addCandidate', (res: { group: Group, candidate: Candidate }) => {
                    const { group, candidate } = res;
                    o.next({ type: CANDIDATE.START });
                    o.next(addCandidateFulfilled(group, candidate));
                    o.next(setShouldUpdateRecruitment());
                    o.next(enqueueSnackbar(`${group}组多了一名报名选手！`, { variant: 'info' }));
                    o.next({ type: CANDIDATE.SUCCESS });
                });

                socket.on('updateRecruitment', () => {
                    o.next({ type: RECRUITMENT.START });
                    o.next(setShouldUpdateRecruitment());
                    o.next({ type: RECRUITMENT.SUCCESS });
                });

                socket.on('receiveMessage', ({ message }: { message: Message }) => {
                    o.next({ type: USER.START });
                    o.next(addMessage({ ...message, isSelf: false }));
                    o.next({ type: USER.SUCCESS });
                });

            }),
        ),
    );

export default [socketConnectEpic, socketReceiveEpic];

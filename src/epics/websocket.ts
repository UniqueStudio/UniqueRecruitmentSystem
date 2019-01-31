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
    toggleProgress,
} from 'Actions';
import { StoreState } from 'Reducers';

import { API } from 'Config/consts';
import { Candidate, Comment, Group, Message, Step } from 'Config/types';

import { Action, Dependencies, Socket } from 'Epics';

const socketConnectEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { io, socket$ }) =>
    action$.pipe(
        ofType('SOCKET_START'),
        switchMap(() =>
            new Observable((o: Subscriber<Socket>) => {
                const socket = io(API);
                socket.on('connect', () => o.next(socket));
                socket.on('disconnect', o.complete);
                return socket.close;
            }),
        ),
        tap(socket$),
        ignoreElements(),
    );

const socketReceiveEpic: Epic<Action, Action, StoreState, Dependencies> = (action$, state$, { socket$ }) =>
    socket$.pipe(
        switchMap((socket: Socket) => !socket ? EMPTY :
            new Observable((o: Subscriber<Action>) => {
                socket.on('removeCandidate', ({ cid }: { cid: string }) => {
                    o.next(toggleProgress(true));
                    o.next(removeCandidateFulfilled(cid));
                    o.next(setShouldUpdateRecruitment());
                    o.next(enqueueSnackbar('有候选人被移除了！', { variant: 'info' }));
                    o.next(toggleProgress());
                });
                socket.on('removeCandidateError', (res: { message: string, type: VariantType }) => {
                    const { message, type } = res;
                    o.next(enqueueSnackbar(`ERROR: ${message}`, { variant: type || 'error' }));
                    o.next(toggleProgress());
                });

                socket.on('moveCandidate', (res: { cid: string, from: Step, to: Step }) => {
                    const { cid, from, to } = res;
                    o.next(toggleProgress(true));
                    o.next(moveCandidateFulfilled(from, to, cid));
                    o.next(setShouldUpdateRecruitment());
                    o.next(enqueueSnackbar('有候选人被移动了！', { variant: 'info' }));
                    o.next(toggleProgress());
                });
                socket.on('moveCandidateSuccess', () => {
                    o.next(setShouldUpdateRecruitment());
                    o.next(toggleProgress());
                });
                socket.on('moveCandidateError', (res: { message: string, type: VariantType, data: { to: Step, from: Step, cid: string } }) => {
                    const { message, type, data } = res;
                    o.next(moveCandidateFulfilled(data.to, data.from, data.cid));
                    o.next(enqueueSnackbar(`ERROR: ${message}`, { variant: type || 'error' }));
                    o.next(toggleProgress());
                });

                socket.on('addComment', (res: { cid: string, comment: Comment }) => {
                    const { cid, comment } = res;
                    o.next(toggleProgress(true));
                    o.next(addCommentFulfilled(cid, comment));
                    o.next(toggleProgress());
                });
                socket.on('addCommentError', (res: { message: string, type: VariantType }) => {
                    const { message, type } = res;
                    o.next(enqueueSnackbar(`ERROR: ${message}`, { variant: type || 'error' }));
                    o.next(toggleProgress());
                });

                socket.on('removeComment', (res: { cid: string, id: string }) => {
                    const { cid, id } = res;
                    o.next(toggleProgress(true));
                    o.next(removeCommentFulfilled(cid, id));
                    o.next(toggleProgress());
                });
                socket.on('removeCommentError', (res: { message: string, type: VariantType }) => {
                    const { message, type } = res;
                    o.next(enqueueSnackbar(`ERROR: ${message}`, { variant: type || 'error' }));
                    o.next(toggleProgress());
                });

                socket.on('addCandidate', (res: { group: Group, candidate: Candidate }) => {
                    const { group, candidate } = res;
                    o.next(toggleProgress(true));
                    o.next(addCandidateFulfilled(group, candidate));
                    o.next(setShouldUpdateRecruitment());
                    o.next(enqueueSnackbar(`${group}组多了一名报名选手！`, { variant: 'info' }));
                    o.next(toggleProgress());
                });

                socket.on('updateRecruitment', () => {
                    o.next(toggleProgress(true));
                    o.next(setShouldUpdateRecruitment());
                    o.next(toggleProgress());
                });

                socket.on('receiveMessage', ({ message }: { message: Message }) => {
                    o.next(toggleProgress(true));
                    o.next(addMessage({ ...message, isSelf: false }));
                    o.next(toggleProgress());
                });
            }),
        ),
    );

export default [socketConnectEpic, socketReceiveEpic];

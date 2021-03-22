import { VariantType } from 'notistack';
import io from 'socket.io-client';

import { API } from '../config/consts';
import { Candidate, Comment, Message, Step } from '../config/types';
import { stores } from '../stores';

// TODO: in current implementation, we cannot distinguish whether the incoming event is fired by the user,
// and it may bring some surprising bugs. Fixes should first be done in the backend.

const { componentStateStore, recruitmentStore, candidateStore, userStore } = stores;

const socket = io(API);

export const addComment = (cid: string, comment: Partial<Comment>) => {
    socket.emit('addComment', { cid, comment, token: userStore.token });
    componentStateStore.setProgress(true);
};

export const removeComment = (cid: string, id: string) => {
    socket.emit('removeComment', { cid, id, token: userStore.token });
    componentStateStore.setProgress(true);
};

export const moveCandidate = (cid: string, from: Step, to: Step, position?: number) => {
    socket.emit('moveCandidate', { cid, from, to, token: userStore.token });
    // Try to move, move back if failed
    candidateStore.moveCandidate(cid, from, to, position);
    componentStateStore.setProgress(true);
};

export const removeCandidate = (cid: string) => {
    socket.emit('removeCandidate', { cid, token: userStore.token });
    componentStateStore.setProgress(true);
};

export const sendMessage = (message: Message) => {
    socket.emit('sendMessage', { message });
    userStore.addMessage(message);
};

socket.on('disconnect', socket.close);

socket.on('removeCandidate', ({ cid, title }: { cid: string; title: string }) => {
    if (title === recruitmentStore.viewing) {
        candidateStore.removeCandidate(cid);
        recruitmentStore.setShouldUpdateRecruitment();
        componentStateStore.enqueueSnackbar('有候选人被移除了！', 'info');
        componentStateStore.setProgress(false);
    }
});
socket.on('removeCandidateError', ({ message, type }: { message: string; type: VariantType }) => {
    componentStateStore.enqueueSnackbar(message, type || 'error');
    componentStateStore.setProgress(false);
});

socket.on('moveCandidate', ({ cid, from, to, title }: { cid: string; from: Step; to: Step; title: string }) => {
    if (title === recruitmentStore.viewing) {
        candidateStore.moveCandidate(cid, from, to);
        recruitmentStore.setShouldUpdateRecruitment();
        componentStateStore.enqueueSnackbar('有候选人被移动了！', 'info');
        componentStateStore.setProgress(false);
    }
});
socket.on('moveCandidateSuccess', () => {
    recruitmentStore.setShouldUpdateRecruitment();
    componentStateStore.setProgress(false);
});
socket.on(
    'moveCandidateError',
    ({
        message,
        type,
        data: { to, from, cid },
    }: {
        message: string;
        type: VariantType;
        data: { to: Step; from: Step; cid: string };
    }) => {
        candidateStore.moveCandidate(cid, to, from);
        componentStateStore.enqueueSnackbar(message, type || 'error');
        componentStateStore.setProgress(false);
    },
);

socket.on('addComment', ({ cid, comment, title }: { cid: string; comment: Comment; title: string }) => {
    if (title === recruitmentStore.viewing) {
        candidateStore.addComment(cid, comment);
        componentStateStore.setProgress(false);
    }
});
socket.on('addCommentError', ({ message, type }: { message: string; type: VariantType }) => {
    componentStateStore.enqueueSnackbar(message, type || 'error');
    componentStateStore.setProgress(false);
});

socket.on('removeComment', ({ cid, id, title }: { cid: string; id: string; title: string }) => {
    if (title === recruitmentStore.viewing) {
        candidateStore.removeComment(cid, id);
        componentStateStore.setProgress(false);
    }
});
socket.on('removeCommentError', ({ message, type }: { message: string; type: VariantType }) => {
    componentStateStore.enqueueSnackbar(message, type || 'error');
    componentStateStore.setProgress(false);
});

socket.on('addCandidate', ({ candidate }: { candidate: Candidate }) => {
    const { title, group } = candidate;
    if (title === recruitmentStore.viewing) {
        candidateStore.addCandidate(candidate);
        componentStateStore.enqueueSnackbar(`${group}组多了一名报名选手！`, 'info');
    }
});

socket.on('updateRecruitment', () => {
    recruitmentStore.setShouldUpdateRecruitment();
});

socket.on('receiveMessage', ({ message }: { message: Message }) => {
    userStore.addMessage({ ...message, isSelf: false });
});

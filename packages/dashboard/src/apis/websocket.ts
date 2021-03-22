import { VariantType } from 'notistack';
import io from 'socket.io-client';

import { API } from '@config/consts';
import { Candidate, Comment, Message, Step } from '@config/types';
import { stores } from '@stores/index';

// TODO: in current implementation, we cannot distinguish whether the incoming event is fired by the user,
// and it may bring some surprising bugs. Fixes should first be done in the backend.

const { $component, $recruitment, $candidate, $user } = stores;

const socket = io(API);

export const addComment = (cid: string, comment: Partial<Comment>) => {
    socket.emit('addComment', { cid, comment, token: $user.token });
    $component.setProgress(true);
};

export const removeComment = (cid: string, id: string) => {
    socket.emit('removeComment', { cid, id, token: $user.token });
    $component.setProgress(true);
};

export const moveCandidate = (cid: string, from: Step, to: Step, position?: number) => {
    socket.emit('moveCandidate', { cid, from, to, token: $user.token });
    // Try to move, move back if failed
    $candidate.moveCandidate(cid, from, to, position);
    $component.setProgress(true);
};

export const removeCandidate = (cid: string) => {
    socket.emit('removeCandidate', { cid, token: $user.token });
    $component.setProgress(true);
};

export const sendMessage = (message: Message) => {
    socket.emit('sendMessage', { message });
    $user.addMessage(message);
};

socket.on('disconnect', () => socket.close());

socket.on('removeCandidate', ({ cid, title }: { cid: string; title: string }) => {
    if (title === $recruitment.viewing) {
        $candidate.removeCandidate(cid);
        $recruitment.setShouldUpdateRecruitment();
        $component.enqueueSnackbar('有候选人被移除了！', 'info');
        $component.setProgress(false);
    }
});
socket.on('removeCandidateError', ({ message, type }: { message: string; type: VariantType }) => {
    $component.enqueueSnackbar(message, type || 'error');
    $component.setProgress(false);
});

socket.on('moveCandidate', ({ cid, from, to, title }: { cid: string; from: Step; to: Step; title: string }) => {
    if (title === $recruitment.viewing) {
        $candidate.moveCandidate(cid, from, to);
        $recruitment.setShouldUpdateRecruitment();
        $component.enqueueSnackbar('有候选人被移动了！', 'info');
        $component.setProgress(false);
    }
});
socket.on('moveCandidateSuccess', () => {
    $recruitment.setShouldUpdateRecruitment();
    $component.setProgress(false);
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
        $candidate.moveCandidate(cid, to, from);
        $component.enqueueSnackbar(message, type || 'error');
        $component.setProgress(false);
    },
);

socket.on('addComment', ({ cid, comment, title }: { cid: string; comment: Comment; title: string }) => {
    if (title === $recruitment.viewing) {
        $candidate.addComment(cid, comment);
        $component.setProgress(false);
    }
});
socket.on('addCommentError', ({ message, type }: { message: string; type: VariantType }) => {
    $component.enqueueSnackbar(message, type || 'error');
    $component.setProgress(false);
});

socket.on('removeComment', ({ cid, id, title }: { cid: string; id: string; title: string }) => {
    if (title === $recruitment.viewing) {
        $candidate.removeComment(cid, id);
        $component.setProgress(false);
    }
});
socket.on('removeCommentError', ({ message, type }: { message: string; type: VariantType }) => {
    $component.enqueueSnackbar(message, type || 'error');
    $component.setProgress(false);
});

socket.on('addCandidate', ({ candidate }: { candidate: Candidate }) => {
    const { title, group } = candidate;
    if (title === $recruitment.viewing) {
        $candidate.addCandidate(candidate);
        $component.enqueueSnackbar(`${group}组多了一名报名选手！`, 'info');
    }
});

socket.on('updateRecruitment', () => {
    $recruitment.setShouldUpdateRecruitment();
});

socket.on('receiveMessage', ({ message }: { message: Message }) => {
    $user.addMessage({ ...message, isSelf: false });
});

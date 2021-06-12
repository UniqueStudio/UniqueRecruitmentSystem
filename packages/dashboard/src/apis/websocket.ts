import { io } from 'socket.io-client';

import { getOneRecruitment } from '@apis/rest';
import { API, STEP_MAP } from '@config/consts';
import { Status, Step } from '@config/enums';
import { Application, Comment, Message, R, Recruitment } from '@config/types';
import { stores } from '@stores/index';

const { $component, $recruitment, $application, $member } = stores;

// TODO: $member.token is empty when user has not logged in, so the connection will be invalid even if he logged in
const socket = io(API, {
    extraHeaders: {
        Authorization:`Bearer ${$member.token}`,
    },
});

export const addComment = (cid: string, comment: Pick<Comment, 'evaluation' | 'content'>) => {
    socket.emit('addComment', { cid, comment });
    $component.setProgress(true);
};

export const removeComment = (id: string) => {
    socket.emit('removeComment', { id });
    $component.setProgress(true);
};

export const sendMessage = (message: Message) => {
    socket.emit('sendMessage', { message });
    $member.addMessage(message);
};

socket.on('disconnect', () => socket.close());

socket.on('addComment', (res: R<{ cid: string; comment: Comment }>) => {
    switch (res.status) {
        case Status.success:
            $component.setProgress(false);
        // eslint-disable-next-line no-fallthrough
        case Status.info: {
            const { cid, comment } = res.payload;
            $application.addComment(cid, comment);
        }
    }
});

socket.on('removeComment', (res: R<{ cid: string; id: string }>) => {
    switch (res.status) {
        case Status.success:
            $component.setProgress(false);
        // eslint-disable-next-line no-fallthrough
        case Status.info: {
            const { cid, id } = res.payload;
            $application.removeComment(cid, id);
        }
    }
});

socket.on('newCandidate', (res: R<Application & { recruitment: Recruitment }>) => {
    switch (res.status) {
        case Status.info: {
            const application = res.payload;
            const { group, candidate, recruitment } = application;
            if (recruitment.id === $recruitment.viewingId) {
                $application.setOne(application);
                $component.enqueueSnackbar(`${candidate.name}报名了${group}组`, Status.info);
            }
        }
    }
});

socket.on('updateCandidate', (res: R<Application & { recruitment: Recruitment }>) => {
    switch (res.status) {
        case Status.info: {
            const application = res.payload;
            const { group, candidate, recruitment } = application;
            if (recruitment.id === $recruitment.viewingId) {
                $application.setOne(application);
                $component.enqueueSnackbar(`${group}组的${candidate.name}更新了个人信息`, Status.info);
            }
        }
    }
});

socket.on('removeCandidate', (res: R<string>) => {
    switch (res.status) {
        case Status.info: {
            const application = $application.applications.get(res.payload);
            if (application) {
                const { group, candidate, id } = application;
                $application.removeOne(id);
                $component.enqueueSnackbar(`${group}组的${candidate.name}被移除了`, res.status);
            }
        }
    }
});

socket.on('moveCandidate', (res: R<{ cid: string; to: Step }>) => {
    switch (res.status) {
        case Status.info: {
            const { cid, to } = res.payload;
            const application = $application.applications.get(cid);
            if (application && application.step !== to) {
                const { group, candidate, id } = application;
                $application.moveOne(id, to);
                $component.enqueueSnackbar(`${group}组的${candidate.name}被移动到了${STEP_MAP.get(to)!}`, res.status);
            }
        }
    }
});

socket.on('updateRecruitment', (res: R<string>) => {
    switch (res.status) {
        case Status.info:
            void getOneRecruitment(res.payload);
    }
});

socket.on('receiveMessage', (res: R<Message>) => {
    switch (res.status) {
        case Status.info:
            $member.addMessage({ ...res.payload, isSelf: false });
    }
});

socket.on('exception', (res: R) => {
    switch (res.status) {
        case Status.error:
        case Status.warning:
            $component.enqueueSnackbar(res.message, res.status);
            $component.setProgress(false);
    }
});

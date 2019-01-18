import { Socket } from 'socket.io';

import { io } from '../../app';
import { Comment } from '../../config/types';
import { CandidateRepo } from '../../database/model';
import { logger } from '../../utils/logger';
import { verifyJWT } from '../../utils/verifyJWT';

export const onAddComment = (socket: Socket) => async (step: number, cid: string, comment: Comment, token: string) => {
    try {
        verifyJWT(token);
        const candidate = await CandidateRepo.queryById(cid);
        if (candidate) {
            candidate.comments.push(comment);
            candidate.save();
            io.emit('addComment', step, cid, comment);
        } else {
            socket.emit('addCommentError', 'candidate doesn\'t exist', 'warning');
        }
    } catch (err) {
        logger.error(err.message);
        socket.emit('addCommentError', err.message, 'danger');
    }
};

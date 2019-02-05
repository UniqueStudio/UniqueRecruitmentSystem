import { Socket } from 'socket.io';

import { io } from '../../app';
import { Comment } from '../../config/types';
import { CandidateRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';
import { logger } from '../../utils/logger';
import { verifyJWT } from '../../utils/verifyJWT';

export const onAddComment = (socket: Socket) => async (req: { cid: string, comment: Comment, token: string }) => {
    try {
        const { cid, comment, token } = req;
        const id = verifyJWT(token);
        const candidate = await CandidateRepo.queryById(cid);
        if (!candidate) {
            return socket.emit('addCommentError', errorRes('candidate doesn\'t exist!', 'warning'));
        }
        if (!comment) {
            return socket.emit('addCommentError', errorRes('No comment provided!', 'warning'));
        }
        const { title } = candidate;
        const { uid, content, evaluation, username } = comment;
        if (uid !== id || !content || !username || ![0, 1, 2].includes(evaluation)) {
            return socket.emit('addCommentError', errorRes('Comment is invalid!', 'warning'));
        }
        const updated = await CandidateRepo.pushById(cid, { comments: { uid, content, evaluation, username } });
        if (!updated) {
            return socket.emit('addCommentError', errorRes('Failed to add comment!', 'warning'));
        }
        return io.emit('addComment', { cid, title, comment: updated.comments.slice(-1)[0] });
    } catch ({ message }) {
        logger.error(message);
        return socket.emit('addCommentError', errorRes(message, 'error'));
    }
};

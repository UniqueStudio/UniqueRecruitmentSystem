import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import { io } from '../../app';
import { CandidateRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';
import { logger } from '../../utils/logger';
import { verifyJWT } from '../../utils/verifyJWT';

export const onRemoveComment = (socket: Socket) => async (req: { cid: string, id: string, token: string }) => {
    try {
        const { cid, id, token } = req;
        const uid = verifyJWT(token);
        const candidate = await CandidateRepo.queryById(cid);
        if (!candidate) {
            return socket.emit('addCommentError', errorRes('Candidate doesn\'t exist!', 'warning'));
        }
        const comment = candidate.comments.find(({ _id }) => _id.toString() === id);
        if (!comment) {
            return socket.emit('addCommentError', errorRes('Comment doesn\'t exist!', 'warning'));
        }
        if (comment.uid !== uid) {
            return socket.emit('addCommentError', errorRes('You don\'t have permission to do this!', 'warning'));
        }
        await CandidateRepo.pullById(cid, { comments: { _id: new Types.ObjectId(id) } });
        return io.emit('removeComment', { cid, id });
    } catch ({ message }) {
        logger.error(message);
        return socket.emit('removeCommentError', errorRes(message, 'error'));
    }
};

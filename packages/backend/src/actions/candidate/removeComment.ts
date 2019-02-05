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
            return socket.emit('removeCommentError', errorRes('Candidate doesn\'t exist!', 'warning'));
        }
        const { title } = candidate;
        const comment = candidate.comments.find(({ _id }) => _id && _id.toString() === id);
        if (!comment) {
            return socket.emit('removeCommentError', errorRes('Comment doesn\'t exist!', 'warning'));
        }
        if (comment.uid !== uid) {
            return socket.emit('removeCommentError', errorRes('You don\'t have permission to do this!', 'warning'));
        }
        await CandidateRepo.pullById(cid, { comments: { _id: new Types.ObjectId(id) } });
        return io.emit('removeComment', { cid, id, title });
    } catch ({ message }) {
        logger.error(message);
        return socket.emit('removeCommentError', errorRes(message, 'error'));
    }
};

import { ObjectId } from 'mongodb';
import { Socket } from 'socket.io';
import { io } from '../../app';
import { CandidateRepo } from '../../database/model';
import { verifyJWT } from '../../utils/verifyJWT';

export const onRemoveComment = (socket: Socket) => async (step: number, cid: string, uid: string, token: string) => {
    try {
        verifyJWT(token);
        await CandidateRepo.update({ '_id': new ObjectId(cid), 'comments.uid': uid }, {
            'comments.$': ''
        }, true);
        io.emit('removeComment', step, cid, uid);
    } catch (err) {
        socket.emit('removeCommentError', err.message, 'danger');
    }
};

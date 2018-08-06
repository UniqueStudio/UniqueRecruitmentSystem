import { Socket } from 'socket.io';
import { verifyJWT } from '../../lib/checkData';
import { ObjectId } from 'mongodb';
import { database, io } from '../../app';

export const onRemoveComment = (socket: Socket) => (step: number, cid: string, uid: string, token: string) => {
    (async () => {
        try {
            verifyJWT(token);
            await database.update('candidates', { _id: new ObjectId(cid) }, { [`comments.${uid}`]: '' }, true);
            io.emit('removeComment', step, cid, uid);
        } catch (err) {
            socket.emit('removeCommentError', err.message, 'danger');
        }
    })();
};
import { Socket } from 'socket.io';
import { verifyJWT } from '../../lib/checkData';
import { ObjectId } from 'mongodb';
import { database, io } from '../../app';

export const onAddComment = (socket: Socket) => (step: number, cid: string, uid: string, comment: object, token: string) => {
    (async () => {
        try {
            verifyJWT(token);
            await database.update('candidates', { _id: new ObjectId(cid) }, { ['comments.' + uid]: comment });
            io.emit('addComment', step, cid, uid, comment);
        } catch (err) {
            socket.emit('addCommentError', err.message, 'danger');
        }
    })();
};
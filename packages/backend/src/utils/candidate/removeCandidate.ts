import { Socket } from 'socket.io';
import { verifyJWT } from '../../lib/checkData';
import { ObjectId } from 'mongodb';
import { database, io } from '../../app';
import { deleteFile } from '../../lib/deleteFile';

export const onRemoveCandidate = (socket: Socket) => (cid: string, token: string) => {
    (async () => {
        try {
            verifyJWT(token);
            const candidate = (await database.query('candidates', { _id: new ObjectId(cid) }))[0];
            deleteFile(candidate.resume);
            await database.delete('candidates', { _id: new ObjectId(cid) });
            io.emit('removeCandidate', cid);
            const recruitment = (await database.query('recruitments', { title: candidate['title'] }))[0];
            const data = recruitment['data'].map((i: object) => {
                if (i['group'] === candidate['group']) {
                    i['total'] -= 1;
                    if (i['total'] < 0) i['total'] = 0;
                    i['steps'][candidate['step']] -= 1;
                    if (i['steps'][candidate['step']] < 0) i['steps'][candidate['step']] = 0;
                }
                return i;
            });
            await database.update('recruitments', { title: candidate['title'] }, {
                data,
                total: recruitment['total'] - 1
            });
            io.emit('updateRecruitment');
        } catch (err) {
            socket.emit('removeCandidateError', err.message, 'danger');
        }
    })();
};
import io from 'socket.io-client';
import { CandidateRepo, UserRepo } from '../src/database/model';
import { generateJWT } from '../src/utils/generateJWT';

describe('WebSocket /addComment', () => {
    let socket: typeof io.Socket;
    beforeEach((done) => {
        socket = io('http://192.168.1.200:5000');
        socket.on('connect', () => {
            console.log('worked...');
            done();
        });
        socket.on('disconnect', () => {
            console.log('disconnected...');
        });
    });

    afterEach((done) => {
        if (socket.connected) {
            console.log('disconnecting...');
            socket.disconnect();
        } else {
            console.log('no connection to break...');
        }
        done();
    });

    it('should return success', async (done) => {
        const users = await UserRepo.query({ weChatID: 'foo' });
        const candidates = await CandidateRepo.query({ name: 'test', title: '2021C' });
        expect(users.length).toBe(1);
        const token = generateJWT({ id: users[0]._id.toString() }, 100000);
        socket.emit('addComment', {
            cid: candidates[0]._id,
            comment: { uid: users[0]._id, content: 'testddd', evaluation: 1, username: 'w1nd3r1c4' },
            token
        });
        socket.on('addComment', (...res: any) => {
            console.log(res);
            done();
        });
        socket.on('addCommentError', (...res: any) => {
            console.log(res);
            throw new Error('addCommentError');
        });
    });
});

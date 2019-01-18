import socketIO from 'socket.io';
import io from 'socket.io-client';

import { wsHandler } from '../src/websocket';

const server = socketIO.listen(5000);
wsHandler(server);

describe('WebSocket /addComment', () => {
    let socket: typeof io.Socket;
    beforeEach((done) => {
        socket = io('http://localhost:5000');
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

    it('should return success', (done) => {
        socket.emit('addComment', 1, 123, {
            uid: 123,
            username: 123,
            content: 123,
            evaluation: 2
        });
        socket.on('addComment', (...res: any) => {
            console.log(res);
            done();
        });
        socket.on('addCommentError', (...res: any) => {
            throw new Error(res[0]);
        });
    });
});

import { Socket } from 'socket.io';

export const messenger = (socket: Socket) => (name: string, avatar: string, time: string, message: string) => {
    socket.broadcast.emit('receiveMessage', name, avatar, time, message);
};
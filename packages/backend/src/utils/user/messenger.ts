import { Socket } from 'socket.io';

export const messenger = (socket: Socket) => (name: string, avatar: string, time: string, message: string, isImage: boolean) => {
    isImage
        ? socket.broadcast.emit('receiveImage', name, avatar, time, message)
        : socket.broadcast.emit('receiveMessage', name, avatar, time, message);
};
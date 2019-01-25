import { Socket } from 'socket.io';
import { Message } from '../../config/types';

export const messenger = (socket: Socket) => ({ message }: { message: Message }) => {
    socket.broadcast.emit('receiveMessage', { message });
};

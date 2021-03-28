import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { Status } from '@constants/enums';
import { Message } from '@interfaces/message.interface';

@WebSocketGateway()
export class ChatGateway {
    @SubscribeMessage('sendMessage')
    handleMessage(
        @MessageBody() { message }: { message: Message },
        @ConnectedSocket() socket: Socket,
    ) {
        socket.broadcast.emit('receiveMessage', {
            status: Status.info,
            payload: message,
        });
        return message;
    }
}

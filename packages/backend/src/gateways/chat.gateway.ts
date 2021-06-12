import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { Role, Status } from '@constants/enums';
import { AcceptRole } from '@decorators/role.decorator';
import { WsRoleGuard } from '@guards/role.guard';
import { Message } from '@interfaces/message.interface';
import { WsBody } from '@interfaces/ws.interface';

@UseGuards(WsRoleGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway {
    @AcceptRole(Role.member)
    @SubscribeMessage('sendMessage')
    handleMessage(@MessageBody() { message }: WsBody<{ message: Message }>, @ConnectedSocket() socket: Socket) {
        socket.broadcast.emit('receiveMessage', {
            status: Status.info,
            payload: message,
        });
    }
}

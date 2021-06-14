import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { Role, Status } from '@constants/enums';
import { AcceptRole } from '@decorators/role.decorator';
import { BaseGateway } from '@gateways/base.gateway';
import { Message } from '@interfaces/message.interface';
import { WsBody } from '@interfaces/ws.interface';

export class ChatGateway extends BaseGateway {
    @AcceptRole(Role.member)
    @SubscribeMessage('sendMessage')
    handleMessage(@MessageBody() { message }: WsBody<{ message: Message }>, @ConnectedSocket() socket: Socket) {
        socket.broadcast.emit('receiveMessage', {
            status: Status.info,
            payload: message,
        });
    }
}

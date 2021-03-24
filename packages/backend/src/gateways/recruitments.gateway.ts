import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { Status } from '@constants/enums';

@Injectable()
@WebSocketGateway()
export class RecruitmentsGateway {
    @WebSocketServer()
    server!: Server;

    broadcastUpdate() {
        this.server.sockets.emit('updateRecruitment', {
            status: Status.info,
        });
    }
}

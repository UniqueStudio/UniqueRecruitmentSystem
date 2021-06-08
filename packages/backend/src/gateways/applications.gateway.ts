import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { Status, Step } from '@constants/enums';
import { ApplicationEntity } from '@entities/application.entity';

@WebSocketGateway({ cors: true })
export class ApplicationsGateway {
    @WebSocketServer()
    server!: Server;

    broadcastNew(application: ApplicationEntity) {
        this.server.sockets.emit('newApplication', {
            status: Status.info,
            payload: application,
        });
    }

    broadcastUpdate(application: ApplicationEntity) {
        this.server.sockets.emit('updateApplication', {
            status: Status.info,
            payload: application,
        });
    }

    broadcastMove(aid: string, to: Step) {
        this.server.sockets.emit('moveApplication', {
            status: Status.info,
            payload: { aid, to },
        });
    }

    broadcastRemove(aid: string) {
        this.server.sockets.emit('removeApplication', {
            status: Status.info,
            payload: aid,
        });
    }
}

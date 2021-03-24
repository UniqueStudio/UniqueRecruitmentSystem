import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { Status } from '@constants/enums';
import { CandidateEntity } from '@entities/candidate.entity';

@WebSocketGateway()
export class CandidatesGateway {
    @WebSocketServer()
    server!: Server;

    broadcastNew(candidate: CandidateEntity) {
        this.server.sockets.emit('newCandidate', {
            status: Status.info,
            payload: candidate,
        });
    };
}

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { Status, Step } from '@constants/enums';
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

    broadcastUpdate(candidate: CandidateEntity) {
        this.server.sockets.emit('updateCandidate', {
            status: Status.info,
            payload: candidate,
        });
    };

    broadcastMove(cid: string, to: Step) {
        this.server.sockets.emit('moveCandidate', {
            status: Status.info,
            payload: { cid, to },
        });
    };

    broadcastRemove(cid: string) {
        this.server.sockets.emit('removeCandidate', {
            status: Status.info,
            payload: cid,
        });
    };
}

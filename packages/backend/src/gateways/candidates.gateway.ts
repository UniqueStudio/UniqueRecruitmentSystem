import { BadRequestException } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Status } from '@constants/enums';
import { MoveCandidateBody, RemoveCandidateBody } from '@dtos/candidate.dto';
import { CandidateEntity } from '@entities/candidate.entity';
import { UserEntity } from '@entities/user.entity';
import { RecruitmentsGateway } from '@gateways/recruitments.gateway';
import { AuthService } from '@services/auth.service';
import { CandidatesService } from '@services/candidates.service';
import { deleteFile } from '@utils/fs';

@WebSocketGateway()
export class CandidatesGateway {
    @WebSocketServer()
    server!: Server;

    constructor(
        private readonly candidatesService: CandidatesService,
        private readonly authService: AuthService,
        private readonly recruitmentsGateway: RecruitmentsGateway,
    ) {
    }

    broadcastNew(candidate: CandidateEntity) {
        this.server.sockets.emit('newCandidate', {
            status: Status.info,
            payload: candidate,
        });
    };

    @SubscribeMessage('moveCandidate')
    async moveCandidate(
        @MessageBody() { cid, from, to, token }: MoveCandidateBody,
        @ConnectedSocket() socket: Socket,
    ) {
        if (!(await this.authService.validateToken(token) instanceof UserEntity)) {
            throw new WsException('Failed to authenticate user');
        }
        const candidate = await this.candidatesService.findOneById(cid);
        if (!candidate) {
            throw new WsException(`Candidate with id ${cid} doesn't exist`);
        }
        const { step, recruitment: { name, end } } = candidate;
        if (+end < Date.now()) {
            throw new BadRequestException(`Recruitment ${name} has already ended`);
        }
        if (step !== from) {
            throw new WsException(`Candidate of id ${cid} has been moved by others`);
        }
        await this.candidatesService.update(cid, { step: to });
        const data = { cid, to };
        socket.broadcast.emit('moveCandidate', {
            status: Status.info,
            payload: data,
        });
        this.recruitmentsGateway.broadcastUpdate();
        return data;
    }

    @SubscribeMessage('removeCandidate')
    async removeCandidate(
        @MessageBody() { cid, token }: RemoveCandidateBody,
        @ConnectedSocket() socket: Socket,
    ) {
        if (!(await this.authService.validateToken(token) instanceof UserEntity)) {
            throw new WsException('Failed to authenticate user');
        }
        const candidate = await this.candidatesService.findOneById(cid);
        if (!candidate) {
            throw new WsException(`Candidate with id ${cid} doesn't exist`);
        }
        const { resume, recruitment: { name, end } } = candidate;
        if (+end < Date.now()) {
            throw new BadRequestException(`Recruitment ${name} has already ended`);
        }
        const data = { cid };
        resume && await deleteFile(resume);
        await candidate.remove();
        socket.broadcast.emit('removeCandidate', {
            status: Status.info,
            payload: data,
        });
        this.recruitmentsGateway.broadcastUpdate();
        return data;
    }
}

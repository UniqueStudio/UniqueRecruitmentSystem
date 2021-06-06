import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { Status } from '@constants/enums';
import { AddCommentBody, RemoveCommentBody } from '@dtos/comment.dto';
import { UserEntity } from '@entities/user.entity';
import { AuthService } from '@services/auth.service';
import { CandidatesService } from '@services/candidates.service';
import { CommentsService } from '@services/comments.service';

@WebSocketGateway({ cors: true })
export class CommentsGateway {
    constructor(
        private readonly candidatesService: CandidatesService,
        private readonly commentsService: CommentsService,
        private readonly authService: AuthService,
    ) {}

    @SubscribeMessage('addComment')
    async addComment(@MessageBody() { cid, comment, token }: AddCommentBody, @ConnectedSocket() socket: Socket) {
        const user = await this.authService.validateToken(token);
        if (!(user instanceof UserEntity)) {
            throw new WsException('Failed to authenticate user');
        }
        const candidate = await this.candidatesService.findOneById(cid);
        const { content, evaluation } = comment;
        const data = {
            cid,
            comment: await this.commentsService.createAndSave({
                user,
                candidate,
                content,
                evaluation,
            }),
        };
        socket.broadcast.emit('addComment', {
            status: Status.info,
            payload: data,
        });
        socket.emit('addComment', {
            status: Status.success,
            payload: data,
        });
    }

    @SubscribeMessage('removeComment')
    async removeComment(@MessageBody() { id, token }: RemoveCommentBody, @ConnectedSocket() socket: Socket) {
        const user = await this.authService.validateToken(token);
        if (!(user instanceof UserEntity)) {
            throw new WsException('Failed to authenticate user');
        }
        const comment = await this.commentsService.findOneById(id);
        if (comment.user.id !== user.id) {
            throw new WsException("You don't have permission to do this");
        }
        const data = {
            cid: comment.candidate.id,
            id,
        };
        await comment.remove();
        socket.broadcast.emit('removeComment', {
            status: Status.info,
            payload: data,
        });
        socket.emit('removeComment', {
            status: Status.success,
            payload: data,
        });
    }
}
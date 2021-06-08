import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { Status } from '@constants/enums';
import { AddCommentBody, RemoveCommentBody } from '@dtos/comment.dto';
import { MemberEntity } from '@entities/member.entity';
import { ApplicationsService } from '@services/applications.service';
import { AuthService } from '@services/auth.service';
import { CommentsService } from '@services/comments.service';

@WebSocketGateway({ cors: true })
export class CommentsGateway {
    constructor(
        private readonly candidatesService: ApplicationsService,
        private readonly commentsService: CommentsService,
        private readonly authService: AuthService,
    ) {}

    @SubscribeMessage('addComment')
    async addComment(@MessageBody() { cid, comment, token }: AddCommentBody, @ConnectedSocket() socket: Socket) {
        // TODO: auth websocket requests using `Authorization` field in HTTP header
        const member = await this.authService.validateToken(token);
        if (!(member instanceof MemberEntity)) {
            throw new WsException('Failed to authenticate member');
        }
        const candidate = await this.candidatesService.findOneById(cid);
        const { content, evaluation } = comment;
        const data = {
            cid,
            comment: await this.commentsService.createAndSave({
                user: member,
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
        const member = await this.authService.validateToken(token);
        if (!(member instanceof MemberEntity)) {
            throw new WsException('Failed to authenticate member');
        }
        const comment = await this.commentsService.findOneById(id);
        if (comment.user.id !== member.id) {
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

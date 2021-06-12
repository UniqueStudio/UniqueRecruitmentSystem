import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { Role, Status } from '@constants/enums';
import { AcceptRole } from '@decorators/role.decorator';
import { AddCommentBody, RemoveCommentBody } from '@dtos/comment.dto';
import { WsRoleGuard } from '@guards/role.guard';
import { WsBody } from '@interfaces/ws.interface';
import { ApplicationsService } from '@services/applications.service';
import { CommentsService } from '@services/comments.service';

@UseGuards(WsRoleGuard)
@WebSocketGateway({ cors: true })
export class CommentsGateway {
    constructor(
        private readonly candidatesService: ApplicationsService,
        private readonly commentsService: CommentsService,
    ) {}

    @AcceptRole(Role.member)
    @SubscribeMessage('addComment')
    async addComment(
        @MessageBody() { cid, comment, member }: WsBody<AddCommentBody>,
        @ConnectedSocket() socket: Socket,
    ) {
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

    @AcceptRole(Role.member)
    @SubscribeMessage('removeComment')
    async removeComment(@MessageBody() { id, member }: WsBody<RemoveCommentBody>, @ConnectedSocket() socket: Socket) {
        const comment = await this.commentsService.findOneById(id);
        if (comment.user.id !== member?.id) {
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

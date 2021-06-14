import { ConnectedSocket, MessageBody, SubscribeMessage, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { Role, Status } from '@constants/enums';
import { AcceptRole } from '@decorators/role.decorator';
import { AddCommentBody, RemoveCommentBody } from '@dtos/comment.dto';
import { BaseGateway } from '@gateways/base.gateway';
import { WsBody } from '@interfaces/ws.interface';
import { ApplicationsService } from '@services/applications.service';
import { AuthService } from '@services/auth.service';
import { CommentsService } from '@services/comments.service';

export class CommentsGateway extends BaseGateway {
    constructor(
        authService: AuthService,
        private readonly applicationsService: ApplicationsService,
        private readonly commentsService: CommentsService,
    ) {
        super(authService);
    }

    @AcceptRole(Role.member)
    @SubscribeMessage('addComment')
    async addComment(
        @MessageBody() { aid, comment, member }: WsBody<AddCommentBody>,
        @ConnectedSocket() socket: Socket,
    ) {
        const application = await this.applicationsService.findOneById(aid);
        const { content, evaluation } = comment;
        const data = {
            aid,
            comment: await this.commentsService.createAndSave({
                member,
                application,
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
        if (comment.member.id !== member?.id) {
            throw new WsException("You don't have permission to do this");
        }
        const data = {
            aid: comment.application.id,
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

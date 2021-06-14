import { UseGuards } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { WsRoleGuard } from '@guards/role.guard';
import { RequestWithIdentity } from '@interfaces/request.interface';
import { WsAuthMiddleware } from '@middlewares/auth';
import { AuthService } from '@services/auth.service';

@UseGuards(WsRoleGuard) // In fact, this guard is useless now
@WebSocketGateway({ cors: true })
export class BaseGateway implements OnGatewayInit {
    @WebSocketServer()
    server!: Server;

    constructor(private readonly authService: AuthService) {}

    afterInit(server: Server) {
        const mw = new WsAuthMiddleware(this.authService);
        server.use((socket, next) => void mw.use(socket.request as RequestWithIdentity, {}, next));
    }
}

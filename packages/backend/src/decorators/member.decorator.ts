import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

import { RequestWithIdentity } from '@interfaces/request.interface';

export const Member = createParamDecorator(
    (_, context: ExecutionContext) => {
        const type = context.getType();
        if (type === 'http') {
            return context.switchToHttp().getRequest<RequestWithIdentity>().member;
        } else {
            return (context.switchToWs().getClient<Socket>().request as RequestWithIdentity).member;
        }
    },
);

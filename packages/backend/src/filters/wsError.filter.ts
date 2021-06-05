import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

import { Status } from '@constants/enums';

@Catch()
export class WsErrorFilter<T extends Error = Error> extends BaseWsExceptionFilter<T> {
    catch(exception: T, host: ArgumentsHost) {
        const res = host.switchToWs().getClient<Socket>();

        if (exception instanceof WsException) {
            res.emit('exception', {
                status: Status.warning,
                message: exception.message,
            });
        } else if (exception instanceof QueryFailedError) {
            res.emit('exception', {
                status: Status.error,
                message: exception.message,
            });
        } else if (exception instanceof EntityNotFoundError) {
            res.emit('exception', {
                status: Status.error,
                message: exception.message,
            });
        } else {
            res.emit('exception', {
                status: Status.error,
                message: exception.message || 'Internal server error',
            });
        }
    }
}

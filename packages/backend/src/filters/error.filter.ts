import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { Status } from '@constants/enums';
import { FailureResponse } from '@interfaces/response.interface';

@Catch()
export class ErrorFilter implements ExceptionFilter {
    catch(exception: { message?: string }, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse<Response<FailureResponse>>();

        if (exception instanceof HttpException) {
            const { message } = exception.getResponse() as { message: string | string[] };
            const status = exception.getStatus();
            res.status(status).json({
                status: status < HttpStatus.INTERNAL_SERVER_ERROR ? Status.warning : Status.error,
                message: Array.isArray(message) ? message.join(', ') : message.toString(),
            });
        } else {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: Status.error,
                message: exception.message || 'Internal server error',
            });
        }
    }
}

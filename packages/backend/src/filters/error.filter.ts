import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { Status } from '@constants/enums';
import { FailureResponse } from '@interfaces/response.interface';

@Catch()
export class ErrorFilter implements ExceptionFilter {
    catch(exception: { message?: string }, host: ArgumentsHost) {
        const res = host.switchToHttp().getResponse<Response<FailureResponse>>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        res.status(status).json({
            status: status < HttpStatus.INTERNAL_SERVER_ERROR ? Status.warning : Status.error,
            message: exception.message ?? 'Internal server error',
        });
    }
}

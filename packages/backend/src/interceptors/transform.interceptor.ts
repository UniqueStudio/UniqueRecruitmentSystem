import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';

import { Status } from '@constants/enums';
import { SuccessResponse } from '@interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
    intercept(_: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(map<T, SuccessResponse<T>>((payload) => ({ status: Status.success, payload })));
    }
}

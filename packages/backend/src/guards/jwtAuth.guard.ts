import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { RequestWithUser } from '@interfaces/request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<RequestWithUser>();
        return !!req.user;
    }
}

import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@constants/enums';
import { RequestWithUser } from '@interfaces/request.interface';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext) {
        const role = this.reflector.get<Role>('role', context.getHandler());
        const req = context.switchToHttp().getRequest<RequestWithUser>();
        switch (role) {
            case Role.admin:
                if (!req.user) {
                    return false;
                }
                return req.user.isAdmin || req.user.isCaptain;
            case Role.user:
                return !!req.user;
            case undefined:
                return true;
            default:
                throw new InternalServerErrorException('Unrecognized role');
        }
    }
}

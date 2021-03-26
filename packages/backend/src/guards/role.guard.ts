import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@constants/enums';
import { RequestWithIdentity } from '@interfaces/request.interface';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext) {
        const role = this.reflector.get<Role>('role', context.getHandler());
        const req = context.switchToHttp().getRequest<RequestWithIdentity>();
        switch (role) {
            case Role.admin:
                if (!req.user) {
                    return false;
                }
                return req.user.isAdmin || req.user.isCaptain;
            case Role.user:
                return !!req.user;
            case Role.candidate:
                if (req.candidate) {
                    if (req.candidate.abandoned) {
                        throw new ForbiddenException('You have already abandoned');
                    }
                    if (req.candidate.rejected) {
                        throw new ForbiddenException('You have already been rejected');
                    }
                    return true;
                }
                return false;
            case undefined:
                return true;
            default:
                throw new InternalServerErrorException('Unrecognized role');
        }
    }
}

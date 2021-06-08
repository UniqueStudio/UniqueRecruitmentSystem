import {
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@constants/enums';
import { Msg } from '@constants/messages';
import { RequestWithIdentity } from '@interfaces/request.interface';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const guard = this.reflector.get<unknown>('role', context.getHandler());
        if (guard === undefined) {
            return true;
        }
        if (typeof guard !== 'number') {
            throw new InternalServerErrorException(Msg.$_INVALID('role guard'));
        }
        const req = context.switchToHttp().getRequest<RequestWithIdentity>();
        let role = 0;
        if (req.member) {
            role |= Role.member;
            if (req.member.isAdmin || req.member.isCaptain) {
                role |= Role.admin;
            }
        }
        if (req.candidate) {
            role |= Role.candidate;
        }
        return !!(guard & role);
    }
}

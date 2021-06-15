import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';

import { Role } from '@constants/enums';
import { Msg } from '@constants/messages';
import { RequestWithIdentity } from '@interfaces/request.interface';

class RoleGuard {
    constructor(protected readonly reflector: Reflector) {}

    checkRole(ctx: ExecutionContext, { member, candidate }: RequestWithIdentity) {
        const guard = this.reflector.get<unknown>('role', ctx.getHandler());
        if (guard === undefined) {
            return true;
        }
        if (typeof guard !== 'number') {
            throw new InternalServerErrorException(Msg.$_INVALID('role guard'));
        }
        let role = 0;
        if (member) {
            role |= Role.member;
            if (member.isAdmin || member.isCaptain) {
                role |= Role.admin;
            }
        }
        if (candidate) {
            role |= Role.candidate;
        }
        return !!(guard & role);
    }
}

@Injectable()
export class HttpRoleGuard extends RoleGuard implements CanActivate {
    constructor(reflector: Reflector) {
        super(reflector);
    }

    canActivate(ctx: ExecutionContext) {
        return this.checkRole(ctx, ctx.switchToHttp().getRequest<RequestWithIdentity>());
    }
}

@Injectable()
export class WsRoleGuard extends RoleGuard implements CanActivate {
    constructor(reflector: Reflector) {
        super(reflector);
    }

    canActivate(ctx: ExecutionContext) {
        return this.checkRole(ctx, ctx.switchToWs().getClient<Socket>().request as RequestWithIdentity);
    }
}

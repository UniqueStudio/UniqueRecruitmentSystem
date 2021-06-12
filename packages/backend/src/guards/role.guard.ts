import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { Role } from '@constants/enums';
import { Msg } from '@constants/messages';
import { CandidateEntity } from '@entities/candidate.entity';
import { MemberEntity } from '@entities/member.entity';
import { RequestWithIdentity } from '@interfaces/request.interface';
import { WsBody } from '@interfaces/ws.interface';
import { AuthService } from '@services/auth.service';

@Injectable()
export class HttpRoleGuard implements CanActivate {
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

@Injectable()
export class WsRoleGuard implements CanActivate {
    constructor(private reflector: Reflector, private authService: AuthService) {}

    async canActivate(context: ExecutionContext) {
        const guard = this.reflector.get<unknown>('role', context.getHandler());
        if (guard === undefined) {
            return true;
        }
        if (typeof guard !== 'number') {
            throw new WsException(Msg.$_INVALID('role guard'));
        }
        const req = context.switchToWs();
        const { headers } = req.getClient<Socket>().handshake;
        const authHeader = headers.authorization;
        let role = 0;
        if (authHeader) {
            const [type, token] = authHeader.split(' ');
            if (type === 'Bearer') {
                const entity = await this.authService.validateToken(token);
                if (entity instanceof MemberEntity) {
                    req.getData<WsBody>().member = entity;
                    role |= Role.member;
                    if (entity.isAdmin || entity.isCaptain) {
                        role |= Role.admin;
                    }
                }
                if (entity instanceof CandidateEntity) {
                    req.getData<WsBody>().candidate = entity;
                    role |= Role.candidate;
                }
            }
        }
        return !!(guard & role);
    }
}

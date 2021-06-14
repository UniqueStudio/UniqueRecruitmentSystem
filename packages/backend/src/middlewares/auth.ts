import { Injectable, NestMiddleware } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { NextFunction, Response } from 'express';

import { CandidateEntity } from '@entities/candidate.entity';
import { MemberEntity } from '@entities/member.entity';
import { RequestWithIdentity } from '@interfaces/request.interface';
import { AuthService } from '@services/auth.service';

@Injectable()
export class HttpAuthMiddleware implements NestMiddleware {
    constructor(private authService: AuthService) {}

    async use(req: RequestWithIdentity, _: Response, next: NextFunction) {
        req.member = undefined;
        req.candidate = undefined;
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const [type, token] = authHeader.split(' ');
            if (type === 'Bearer') {
                const entity = await this.authService.validateToken(token);
                if (entity instanceof MemberEntity) {
                    req.member = entity;
                } else if (entity instanceof CandidateEntity) {
                    req.candidate = entity;
                }
            }
        }
        next();
    }
}

export class WsAuthMiddleware implements NestMiddleware {
    constructor(private authService: AuthService) {}

    async use(req: RequestWithIdentity, _: unknown, next: (err?: Error) => void) {
        req.member = undefined;
        req.candidate = undefined;
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const [type, token] = authHeader.split(' ');
            if (type === 'Bearer') {
                const entity = await this.authService.validateToken(token);
                // TODO: only members are allowed now, can we make it more extensive?
                if (entity instanceof MemberEntity) {
                    req.member = entity;
                    next();
                    return;
                }
            }
        }
        next(new WsException('forbidden'));
    }
}

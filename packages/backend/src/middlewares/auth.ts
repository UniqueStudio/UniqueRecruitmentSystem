import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { CandidateEntity } from '@entities/candidate.entity';
import { UserEntity } from '@entities/user.entity';
import { RequestWithIdentity } from '@interfaces/request.interface';
import { AuthService } from '@services/auth.service';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
    constructor(private authService: AuthService) {
    }

    async use(req: RequestWithIdentity, _: Response, next: NextFunction) {
        req.user = undefined;
        req.candidate = undefined;
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const [type, token] = authHeader.split(' ');
            if (type === 'Bearer') {
                const entity = await this.authService.validateToken(token);
                if (entity instanceof UserEntity) {
                    req.user = entity;
                } else if (entity instanceof CandidateEntity) {
                    req.candidate = entity;
                }
            }
        }
        next();
    }
}

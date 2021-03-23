import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { RequestWithUser } from '@interfaces/request.interface';
import { AuthService } from '@services/auth.service';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
    constructor(private authService: AuthService) {}

    async use(req: RequestWithUser, _: Response, next: NextFunction) {
        req.user = undefined;
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const [type, token] = authHeader.split(' ');
            if (type === 'Bearer') {
                req.user = await this.authService.validateToken(token);
            }
        }
        next();
    }
}

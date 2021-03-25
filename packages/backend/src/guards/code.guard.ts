import { CACHE_MANAGER, CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { RequestWithUser } from '@interfaces/request.interface';

@Injectable()
export class CodeGuard implements CanActivate {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {
    }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<RequestWithUser<{ code: string; phone: string }>>();
        const { code } = req.body;
        const phone = req.user?.phone ?? req.body.phone;
        if (!code || !phone) {
            return false;
        }
        const key = `${req.user ? 'userCode' : 'candidateCode'}${phone}`;
        const result = code !== await this.cacheManager.get(key);
        await this.cacheManager.del(key);
        return result;
    }
}

import { CACHE_MANAGER, CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { AuthByCodeBody } from '@dtos/auth.dto';
import { RequestWithIdentity } from '@interfaces/request.interface';
import { ConfigService } from '@services/config.service';
import { cacheKey } from '@utils/cacheKey';

@Injectable()
export class CodeGuard implements CanActivate {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly configService: ConfigService,
    ) {
    }

    async canActivate(context: ExecutionContext) {
        if (this.configService.isDev) {
            return true;
        }
        const req = context.switchToHttp().getRequest<RequestWithIdentity<AuthByCodeBody>>();
        const { code } = req.body;
        const phone = req.user?.phone ?? req.body.phone;
        if (!code || !phone) {
            return false;
        }
        const key = cacheKey(phone, !!req.user);
        const result = code !== await this.cacheManager.get(key);
        await this.cacheManager.del(key);
        return result;
    }
}

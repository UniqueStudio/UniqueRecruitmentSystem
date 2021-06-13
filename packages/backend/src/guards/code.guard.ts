import { CACHE_MANAGER, CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { Role } from '@constants/enums';
import { AuthByCodeBody } from '@dtos/auth.dto';
import { RequestWithIdentity } from '@interfaces/request.interface';
import { ConfigService } from '@services/config.service';
import { cacheKey } from '@utils/cacheKey';

@Injectable()
export class CodeGuard implements CanActivate {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext) {
        if (this.configService.isNotProd) {
            return true;
        }
        const req = context.switchToHttp().getRequest<RequestWithIdentity<AuthByCodeBody>>();
        const { code } = req.body;
        if (!code) {
            return false;
        }
        let key: string;
        if (req.member) {
            key = cacheKey(req.member.phone, Role.member);
        } else if (req.candidate) {
            key = cacheKey(req.candidate.phone, Role.candidate);
        } else {
            key = cacheKey(req.body.phone);
        }
        const cachedCode = await this.cacheManager.get(key);
        await this.cacheManager.del(key);
        return code === cachedCode;
    }
}

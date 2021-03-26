import { forwardRef, Module } from '@nestjs/common';

import { SMSController } from '@controllers/sms.controller';
import { CacheModule } from '@modules/cache.module';
import { CandidatesModule } from '@modules/candidates.module';
import { AppConfigService } from '@services/config.service';
import { SMSService } from '@services/sms.service';

@Module({
    imports: [
        CacheModule,
        forwardRef(() => CandidatesModule),
    ],
    controllers: [SMSController],
    providers: [SMSService, AppConfigService],
    exports: [SMSService],
})
export class SMSModule {
}

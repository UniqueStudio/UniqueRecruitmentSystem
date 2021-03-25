import { Module } from '@nestjs/common';

import { SMSController } from '@controllers/sms.controller';
import { CacheModule } from '@modules/cache.module';
import { CandidatesModule } from '@modules/candidates.module';
import { AppConfigService } from '@services/config.service';

@Module({
    imports: [CacheModule, CandidatesModule],
    providers: [SMSController, AppConfigService],
})
export class SMSModule {
}

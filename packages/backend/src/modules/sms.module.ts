import { forwardRef, Module } from '@nestjs/common';

import { SMSController } from '@controllers/sms.controller';
import { CandidatesModule } from '@modules/candidates.module';
import { SMSService } from '@services/sms.service';

@Module({
    imports: [
        forwardRef(() => CandidatesModule),
    ],
    controllers: [SMSController],
    providers: [SMSService],
    exports: [SMSService],
})
export class SMSModule {
}

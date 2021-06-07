import { forwardRef, Module } from '@nestjs/common';

import { SMSController } from '@controllers/sms.controller';
import { ApplicationsModule } from '@modules/applications.module';
import { SMSService } from '@services/sms.service';

@Module({
    imports: [forwardRef(() => ApplicationsModule)],
    controllers: [SMSController],
    providers: [SMSService],
    exports: [SMSService],
})
export class SMSModule {}

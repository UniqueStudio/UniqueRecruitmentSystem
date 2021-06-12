import { Module } from '@nestjs/common';

import { ChatGateway } from '@gateways/chat.gateway';
import { AuthModule } from '@modules/auth.module';

@Module({
    imports: [AuthModule],
    providers: [ChatGateway],
    exports: [ChatGateway],
})
export class ChatModule {}

import { Module } from '@nestjs/common';

import { ChatGateway } from '@gateways/chat.gateway';

@Module({
    providers: [ChatGateway],
    exports: [ChatGateway],
})
export class ChatModule {
}

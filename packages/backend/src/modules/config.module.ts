import { Global, Module } from '@nestjs/common';
import { ConfigModule as DefaultConfigModule } from '@nestjs/config';

import { ConfigService } from '@services/config.service';

@Global()
@Module({
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule extends DefaultConfigModule {
}

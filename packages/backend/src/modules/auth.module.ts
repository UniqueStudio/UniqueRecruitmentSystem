import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '@controllers/auth.controller';
import { CacheModule } from '@modules/cache.module';
import { CandidatesModule } from '@modules/candidates.module';
import { UsersModule } from '@modules/users.module';
import { AuthService } from '@services/auth.service';
import { AppConfigService } from '@services/config.service';

@Module({
    imports: [
        UsersModule,
        CacheModule,
        ConfigModule,
        CandidatesModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (conf: ConfigService) => ({
                secret: conf.get('JWT_KEY'),
                signOptions: {
                    expiresIn: '7 days',
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, AppConfigService],
    exports: [AuthService],
})
export class AuthModule {
}

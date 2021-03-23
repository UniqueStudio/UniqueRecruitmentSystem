import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@modules/users.module';
import { AuthService } from '@services/auth.service';

@Module({
    imports: [
        UsersModule,
        ConfigModule,
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
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}

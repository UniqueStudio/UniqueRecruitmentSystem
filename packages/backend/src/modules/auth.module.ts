import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '@controllers/auth.controller';
import { CandidatesModule } from '@modules/candidates.module';
import { UsersModule } from '@modules/users.module';
import { AuthService } from '@services/auth.service';
import { ConfigService } from '@services/config.service';

@Module({
    imports: [
        UsersModule,
        CandidatesModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (conf: ConfigService) => ({
                secret: conf.jwtKey,
                signOptions: {
                    expiresIn: '7 days',
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {
}

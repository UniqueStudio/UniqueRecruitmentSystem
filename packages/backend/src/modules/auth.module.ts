import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '@controllers/auth.controller';
import { CandidatesModule } from '@modules/candidates.module';
import { MembersModule } from '@modules/members.module';
import { AuthService } from '@services/auth.service';
import { ConfigService } from '@services/config.service';

@Module({
    imports: [
        MembersModule,
        CandidatesModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (conf: ConfigService) => conf.jwtConfig,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}

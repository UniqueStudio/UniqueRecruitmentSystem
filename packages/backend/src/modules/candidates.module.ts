import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CandidatesController } from '@controllers/candidates.controller';
import { CandidateEntity } from '@entities/candidate.entity';
import { CandidatesGateway } from '@gateways/candidates.gateway';
import { AuthModule } from '@modules/auth.module';
import { EmailModule } from '@modules/email.module';
import { RecruitmentsModule } from '@modules/recruitments.module';
import { SMSModule } from '@modules/sms.module';
import { CandidatesService } from '@services/candidates.service';
import { ConfigService } from '@services/config.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([CandidateEntity]),
        MulterModule.registerAsync({
            inject: [ConfigService],
            useFactory: (conf: ConfigService) => conf.multerConfig,
        }),
        forwardRef(() => AuthModule),
        SMSModule,
        EmailModule,
        RecruitmentsModule,
    ],
    controllers: [CandidatesController],
    providers: [CandidatesService, CandidatesGateway],
    exports: [CandidatesService, CandidatesGateway],
})
export class CandidatesModule {}
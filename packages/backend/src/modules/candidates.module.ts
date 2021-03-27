import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CandidatesController } from '@controllers/candidates.controller';
import { CandidateEntity } from '@entities/candidate.entity';
import { CandidatesGateway } from '@gateways/candidates.gateway';
import { AuthModule } from '@modules/auth.module';
import { CacheModule } from '@modules/cache.module';
import { RecruitmentsModule } from '@modules/recruitments.module';
import { SMSModule } from '@modules/sms.module';
import { CandidatesService } from '@services/candidates.service';
import { AppConfigService } from '@services/config.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([CandidateEntity]),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (conf: ConfigService) => ({
                limits: {
                    fileSize: 104857600, // 100MB
                },
                dest: conf.get('RESUME_TEMPORARY_PATH'),
            }),
        }),
        forwardRef(() => AuthModule),
        CacheModule,
        SMSModule,
        RecruitmentsModule,
    ],
    controllers: [CandidatesController],
    providers: [CandidatesService, CandidatesGateway, AppConfigService],
    exports: [CandidatesService, CandidatesGateway],
})
export class CandidatesModule {
}

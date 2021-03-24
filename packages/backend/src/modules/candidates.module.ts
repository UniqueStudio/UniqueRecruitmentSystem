import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CandidatesController } from '@controllers/candidates.controller';
import { CandidateEntity } from '@entities/candidate.entity';
import { CandidatesGateway } from '@gateways/candidates.gateway';
import { RecruitmentsGateway } from '@gateways/recruitments.gateway';
import { RecruitmentsModule } from '@modules/recruitments.module';
import { CandidatesService } from '@services/candidates.service';

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
        RecruitmentsModule,
    ],
    controllers: [CandidatesController],
    providers: [CandidatesService, CandidatesGateway, RecruitmentsGateway],
    exports: [CandidatesService],
})
export class CandidatesModule {
}

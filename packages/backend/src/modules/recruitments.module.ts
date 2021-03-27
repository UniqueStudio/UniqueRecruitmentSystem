import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecruitmentsController } from '@controllers/recruitments.controller';
import { InterviewEntity } from '@entities/interview.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { RecruitmentsGateway } from '@gateways/recruitments.gateway';
import { CacheModule } from '@modules/cache.module';
import { AppConfigService } from '@services/config.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([RecruitmentEntity, InterviewEntity]),
        CacheModule,
    ],
    controllers: [RecruitmentsController],
    providers: [RecruitmentsService, RecruitmentsGateway, InterviewsService, AppConfigService],
    exports: [RecruitmentsService, RecruitmentsGateway, InterviewsService],
})
export class RecruitmentsModule {
}

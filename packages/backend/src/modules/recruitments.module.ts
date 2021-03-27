import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecruitmentsController } from '@controllers/recruitments.controller';
import { InterviewEntity } from '@entities/interview.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { RecruitmentsGateway } from '@gateways/recruitments.gateway';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';

@Module({
    imports: [TypeOrmModule.forFeature([RecruitmentEntity, InterviewEntity])],
    controllers: [RecruitmentsController],
    providers: [RecruitmentsService, RecruitmentsGateway, InterviewsService],
    exports: [RecruitmentsService, RecruitmentsGateway, InterviewsService],
})
export class RecruitmentsModule {
}

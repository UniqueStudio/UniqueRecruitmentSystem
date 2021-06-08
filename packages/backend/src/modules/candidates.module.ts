import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CandidatesController } from '@controllers/candidates.controller';
import { CandidateEntity } from '@entities/candidate.entity';
import { CandidatesService } from '@services/candidates.service';

@Module({
    imports: [TypeOrmModule.forFeature([CandidateEntity])],
    controllers: [CandidatesController],
    providers: [CandidatesService],
    exports: [CandidatesService],
})
export class CandidatesModule {}

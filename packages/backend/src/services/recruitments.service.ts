import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { RecruitmentEntity } from '@entities/recruitment.entity';
import { BasicCRUDService } from '@services/basicCRUD.service';

@Injectable()
export class RecruitmentsService extends BasicCRUDService<RecruitmentEntity> {
    constructor(
        @InjectRepository(RecruitmentEntity) repository: Repository<RecruitmentEntity>,
    ) {
        super(repository);
    }

    findPending(): Promise<Omit<RecruitmentEntity, 'interviews' | 'candidates'>[]> {
        const now = new Date();
        return this.find({
            where: {
                end: MoreThanOrEqual(now),
                beginning: LessThanOrEqual(now),
            },
        });
    }

    findOneWithCandidates(id: string) {
        return this.findOneById(id, {
            relations: ['candidates', 'candidates.comments', 'candidates.interviews'],
        });
    }
}

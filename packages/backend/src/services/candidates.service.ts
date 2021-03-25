import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { CandidateEntity } from '@entities/candidate.entity';
import { BasicCRUDService } from '@services/basicCRUD.service';

@Injectable()
export class CandidatesService extends BasicCRUDService<CandidateEntity> {
    constructor(
        @InjectRepository(CandidateEntity) repository: Repository<CandidateEntity>,
    ) {
        super(repository);
    }

    findManyByIds(ids: string[]) {
        return this.repository.findByIds(ids);
    }

    findInPendingRecruitments(phone: string) {
        const now = new Date();
        return this.find({
            where: {
                recruitment: {
                    end: MoreThanOrEqual(now),
                    begin: LessThanOrEqual(now),
                },
                phone,
            },
        });
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CandidateEntity } from '@entities/candidate.entity';
import { BasicCRUDService, TimestampOptions } from '@services/basicCRUD.service';

@Injectable()
export class CandidatesService extends BasicCRUDService<CandidateEntity> {
    constructor(
        @InjectRepository(CandidateEntity) repository: Repository<CandidateEntity>,
    ) {
        super(repository, 'candidate');
    }

    findOneById(id: string) {
        return super.findOneById(id, {
            relations: ['recruitment', 'recruitment.interviews', 'interviewSelections'],
        });
    }

    findManyByIds(ids: string[]) {
        return this.repository.findByIds(ids, {
            relations: ['recruitment', 'recruitment.interviews', 'interviewSelections'],
        });
    }

    findManyByRecruitmentId(rid: string, options: TimestampOptions) {
        return this.withTimestamp(options)
            .leftJoinAndSelect(`${this.alias}.recruitment`, 'r')
            .andWhere('r.id = :rid', { rid })
            .getMany();
    }

    findInPendingRecruitments(phone: string) {
        const now = new Date();
        return this.repository
            .createQueryBuilder('candidate')
            .leftJoinAndSelect('candidate.recruitment', 'recruitment')
            .where('candidate.phone = :phone', {phone})
            .andWhere('recruitment.beginning <= :now', {now})
            .andWhere('recruitment.end >= :now', {now})
            .getMany();
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CandidateEntity } from '@entities/candidate.entity';
import { BasicCRUDService } from '@services/basicCRUD.service';

@Injectable()
export class CandidatesService extends BasicCRUDService<CandidateEntity> {
    constructor(
        @InjectRepository(CandidateEntity) repository: Repository<CandidateEntity>,
    ) {
        super(repository);
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

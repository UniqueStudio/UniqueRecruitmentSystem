import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository, SelectQueryBuilder } from 'typeorm';

import { RecruitmentEntity } from '@entities/recruitment.entity';
import { BasicCRUDService } from '@services/basicCRUD.service';

@Injectable()
export class RecruitmentsService extends BasicCRUDService<RecruitmentEntity> {
    constructor(
        @InjectRepository(RecruitmentEntity) repository: Repository<RecruitmentEntity>,
    ) {
        super(repository);
    }

    findPending(): Promise<Omit<RecruitmentEntity, 'interviews' | 'candidates' | 'statistics'>[]> {
        const now = new Date();
        return this.find({
            where: {
                end: MoreThanOrEqual(now),
                beginning: LessThanOrEqual(now),
            },
        });
    }

    findOneWithCandidates(id: string): Promise<Omit<RecruitmentEntity, 'interviews' | 'statistics'> | undefined> {
        return this.findOneById(id, {
            relations: ['candidates', 'candidates.comments', 'candidates.interviewSelections'],
        });
    }

    async findWithStatistics(): Promise<Omit<RecruitmentEntity, 'candidates'>[]> {
        return this.repository
            .createQueryBuilder('r')
            .leftJoinAndSelect('r.interviews', 'interviews')
            .leftJoin(RecruitmentsService.aggregateRecruitments, 's', 's.id = r.id')
            .addSelect('s.jsonb_object_agg', 'r_statistics')
            .addSelect('r.*')
            .getMany();
    }

    private static aggregateSteps(this: void, qb: SelectQueryBuilder<unknown>) {
        return qb
            .from(RecruitmentEntity, 'r')
            .select('r.id', 'id')
            .addSelect('c.group', 'group')
            .addSelect('c.step', 'step')
            .addSelect('count(*)')
            .where('c.step is not null')
            .leftJoin('r.candidates', 'c')
            .groupBy('c.group')
            .addGroupBy('c.step')
            .addGroupBy('r.id');
    }

    private static aggregateGroups(this: void, qb: SelectQueryBuilder<unknown>) {
        return qb
            .from(RecruitmentsService.aggregateSteps, 'r')
            .select('r.id', 'id')
            .addSelect('r.group', 'group')
            .addSelect('jsonb_object_agg(r.step, r.count)')
            .groupBy('r.id')
            .addGroupBy('r.group');
    }

    private static aggregateRecruitments(this: void, qb: SelectQueryBuilder<unknown>) {
        return qb
            .from(RecruitmentsService.aggregateGroups, 'r')
            .select('r.id', 'id')
            .addSelect('jsonb_object_agg(r.group, r.jsonb_object_agg)')
            .groupBy('r.id');
    }
}

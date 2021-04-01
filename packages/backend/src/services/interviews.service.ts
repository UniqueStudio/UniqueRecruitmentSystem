import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { GroupOrTeam } from '@constants/enums';
import { CommonEntity } from '@entities/common.entity';
import { InterviewEntity } from '@entities/interview.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { BasicCRUDService } from '@services/basicCRUD.service';

@Injectable()
export class InterviewsService extends BasicCRUDService<InterviewEntity> {
    constructor(
        @InjectRepository(InterviewEntity) repository: Repository<InterviewEntity>,
        private readonly connection: Connection,
    ) {
        super(repository);
    }

    saveMany(interviews: Omit<InterviewEntity, keyof CommonEntity | 'candidates'>[]) {
        return this.connection.transaction((manager) =>
            Promise.all(interviews.map((interview) => manager.save(InterviewEntity, interview))),
        );
    }

    async findManyWithCandidates(rid: string, name: GroupOrTeam) {
        return await this.repository
            .createQueryBuilder('interview')
            .leftJoinAndSelect('interview.candidates', 'candidates')
            .leftJoinAndSelect('interview.recruitment', 'recruitment')
            .where('recruitment.id = :rid', { rid })
            .andWhere('interview.name = :name', { name })
            .getMany();
    }

    findManyByIdsInRecruitment(ids: string[], recruitment: RecruitmentEntity, name: GroupOrTeam) {
        return this.repository.findByIds(ids, {
            where: {
                name,
                recruitment,
            },
        });
    }
}

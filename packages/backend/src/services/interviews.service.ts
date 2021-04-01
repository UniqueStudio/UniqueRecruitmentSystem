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

    async updateOne(
        newInterview: Omit<InterviewEntity, Exclude<keyof CommonEntity, 'id'> | 'name' | 'recruitment' | 'candidates'>,
        recruitment: RecruitmentEntity,
        name: GroupOrTeam,
    ) {
        const { date, id, period, slotNumber } = newInterview;
        const interview = await this.repository
            .createQueryBuilder('interview')
            .leftJoinAndSelect('interview.candidates', 'candidates')
            .leftJoinAndSelect('interview.recruitment', 'recruitment')
            .where('interview.id = :id', { id })
            .andWhere('recruitment.id = :rid', { rid: recruitment.id })
            .andWhere('interview.name = :name', { name })
            .getOneOrFail();
        if (interview.candidates.length && (+interview.date !== +date || interview.period !== period)) {
            return false;
        }
        interview.slotNumber = slotNumber;
        interview.date = date;
        interview.period = period;
        await interview.save();
        return true;
    }

    async deleteOne(id: string, recruitment: RecruitmentEntity, name: GroupOrTeam) {
        const interview = await this.repository
            .createQueryBuilder('interview')
            .leftJoinAndSelect('interview.candidates', 'candidates')
            .leftJoinAndSelect('interview.recruitment', 'recruitment')
            .where('interview.id = :id', { id })
            .andWhere('recruitment.id = :rid', { rid: recruitment.id })
            .andWhere('interview.name = :name', { name })
            .getOneOrFail();
        if (interview.candidates.length) {
            return false;
        }
        await interview.remove();
        return true;
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

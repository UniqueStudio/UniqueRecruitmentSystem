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
        super(repository, 'interviews');
    }

    saveMany(interviews: Omit<InterviewEntity, keyof CommonEntity>[]) {
        return this.connection.transaction((manager) =>
            Promise.all(interviews.map((interview) => manager.save(InterviewEntity, interview))),
        );
    }

    updateMany(
        interviews: Omit<InterviewEntity, Exclude<keyof CommonEntity, 'id'> | 'name' | 'recruitment'>[],
        recruitment: RecruitmentEntity,
        name: GroupOrTeam,
    ) {
        return this.connection.transaction((manager) =>
            Promise.all(interviews.map(async ({ id, date, period, slotNumber }) => {
                const interview = await manager.findOneOrFail(InterviewEntity, {
                    id,
                    recruitment,
                    name,
                });
                interview.slotNumber = slotNumber;
                interview.date = date;
                interview.period = period;
                await interview.save();
            })),
        );
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

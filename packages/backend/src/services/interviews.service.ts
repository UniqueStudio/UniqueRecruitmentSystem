import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { GroupOrTeam } from '@constants/enums';
import { InterviewEntity } from '@entities/interview.entity';
import { BasicCRUDService } from '@services/basicCRUD.service';

@Injectable()
export class InterviewsService extends BasicCRUDService<InterviewEntity> {
    constructor(
        @InjectRepository(InterviewEntity) repository: Repository<InterviewEntity>,
        private readonly connection: Connection,
    ) {
        super(repository);
    }

    saveMany(interviews: Partial<InterviewEntity>[]) {
        return this.connection.transaction((manager) =>
            Promise.all(interviews.map((interview) => manager.save(InterviewEntity, interview))),
        );
    }

    findManyByIds(ids: string[], name: GroupOrTeam) {
        return this.repository.findByIds(ids, {
            where: {
                name,
            },
        });
    }
}

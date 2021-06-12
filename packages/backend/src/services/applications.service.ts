import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

import { ApplicationEntity } from '@entities/application.entity';
import { BasicCRUDService } from '@services/basicCRUD.service';

@Injectable()
export class ApplicationsService extends BasicCRUDService<ApplicationEntity> {
    relations = {
        forCandidate: ['interviewSelections', 'candidate'],
        forInterview: ['recruitment', 'recruitment.interviews', 'interviewSelections', 'candidate'],
        forMember: ['recruitment', 'interviewSelections', 'comments', 'comments.member', 'candidate'],
    };

    constructor(@InjectRepository(ApplicationEntity) repository: Repository<ApplicationEntity>) {
        super(repository);
    }

    findOneByIdForMember(id: string) {
        return super.findOneById(id, { relations: this.relations.forMember });
    }

    findOneByIdForInterview(id: string) {
        return super.findOneById(id, { relations: this.relations.forInterview });
    }

    findOneByIdForCandidate(id: string) {
        return super.findOneById(id, { relations: this.relations.forCandidate });
    }

    findManyByIds(ids: string[]) {
        return this.repository.findByIds(ids, { relations: this.relations.forInterview });
    }

    findManyByRecruitmentId(rid: string, since: Date) {
        return this.find({
            where: {
                recruitment: {
                    id: rid,
                },
                updatedAt: MoreThan(since),
            },
            relations: this.relations.forMember,
        });
    }
}

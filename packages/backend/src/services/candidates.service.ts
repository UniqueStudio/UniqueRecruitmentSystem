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
}

import { randomBytes } from 'crypto';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CandidateEntity } from '@entities/candidate.entity';
import { BasicCRUDService } from '@services/basicCRUD.service';
import { hash } from '@utils/scrypt';

@Injectable()
export class CandidatesService extends BasicCRUDService<CandidateEntity> {
    constructor(@InjectRepository(CandidateEntity) repository: Repository<CandidateEntity>) {
        super(repository);
    }

    findOneById(id: string) {
        return super.findOneById(id, { relations: ['applications', 'applications.recruitment'] });
    }

    findByPhoneWithPassword(phone: string) {
        return this.findOne(
            {
                phone,
            },
            {
                select: ['id', 'password.hash' as keyof CandidateEntity, 'password.salt' as keyof CandidateEntity],
            },
        );
    }

    hashPassword(password: string) {
        return hash(password);
    }

    async hashPasswordAndCreate(data: Partial<CandidateEntity>, password = randomBytes(512).toString('hex')) {
        const { hash, salt } = await this.hashPassword(password);
        return await this.createAndSave({
            ...data,
            password: {
                hash: hash,
                salt,
            },
        });
    }
}

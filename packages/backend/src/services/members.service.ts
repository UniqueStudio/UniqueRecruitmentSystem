import { randomBytes } from 'crypto';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Group } from '@constants/enums';
import { MemberEntity } from '@entities/member.entity';
import { BasicCRUDService } from '@services/basicCRUD.service';
import { hash } from '@utils/scrypt';

@Injectable()
export class MembersService extends BasicCRUDService<MemberEntity> {
    constructor(@InjectRepository(MemberEntity) repository: Repository<MemberEntity>) {
        super(repository);
    }

    findByPhoneWithPassword(phone: string) {
        return this.findOne(
            {
                phone,
            },
            {
                select: ['id', 'password.hash' as keyof MemberEntity, 'password.salt' as keyof MemberEntity],
            },
        );
    }

    findInGroup(group: Group) {
        return this.find({
            where: {
                group,
            },
            order: {
                createdAt: 'ASC',
            },
        });
    }

    async findOrCreate(data: Partial<MemberEntity>) {
        return (await this.findOne({ weChatID: data.weChatID })) ?? (await this.hashPasswordAndCreate(data));
    }

    hashPassword(password: string) {
        return hash(password);
    }

    async hashPasswordAndCreate(data: Partial<MemberEntity>, password = randomBytes(512).toString('hex')) {
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

import { randomBytes } from 'crypto';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Group } from '@constants/enums';
import { UserEntity } from '@entities/user.entity';
import { BasicCRUDService } from '@services/basicCRUD.service';
import { hash } from '@utils/scrypt';

@Injectable()
export class UsersService extends BasicCRUDService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity) repository: Repository<UserEntity>,
    ) {
        super(repository, 'user');
    }

    findIdentityByPhone(phone: string): Promise<Pick<UserEntity, 'id' | 'password'> | undefined> {
        return this.findOne(
            {
                phone,
            },
            {
                select: ['id', 'password.hash' as keyof UserEntity, 'password.salt' as keyof UserEntity],
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

    async findOrCreate(data: Partial<UserEntity>) {
        return (await this.findOne({ weChatID: data.weChatID }))
            ?? (await this.hashPasswordAndCreate(data));
    }

    hashPassword(password: string) {
        return hash(password);
    }

    async hashPasswordAndCreate(data: Partial<UserEntity>, password = randomBytes(512).toString('hex')) {
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

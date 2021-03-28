import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, ObjectLiteral, Repository } from 'typeorm';

export interface TimestampOptions {
    createdAt?: Date;
    updatedAt?: Date;
}

export abstract class BasicCRUDService<T extends ObjectLiteral> {
    protected constructor(protected readonly repository: Repository<T>, protected readonly alias: string) {}

    async createAndSave(data: DeepPartial<T>) {
        const object = this.repository.create(data);
        const errors = await validate(object);
        if (errors.length) {
            throw new BadRequestException(errors.join(', '));
        }
        return await this.repository.save(object);
    }

    find(options?: FindManyOptions<T>) {
        return this.repository.find(options);
    }

    findOne(conditions?: FindConditions<T>, options?: FindOneOptions<T>) {
        return this.repository.findOne(conditions, options);
    }

    findOneById(id: string, options?: FindOneOptions<T>) {
        return this.repository.findOne(id, options);
    }

    withTimestamp({ updatedAt, createdAt }: TimestampOptions) {
        return this.repository
            .createQueryBuilder(this.alias)
            .where(updatedAt ? `${this.alias}.updatedAt >= :updatedAt` : '1=1', {updatedAt})
            .andWhere(createdAt ? `${this.alias}.createdAt >= :createdAt` : '1=1', {createdAt});
    }

    update: Repository<T>['update'] = (...args) => this.repository.update(...args);

    delete: Repository<T>['delete'] = (...args) => this.repository.delete(...args);

    count(options?: FindManyOptions<T>) {
        return this.repository.count(options);
    }

    clear() {
        return this.delete({});
    }
}

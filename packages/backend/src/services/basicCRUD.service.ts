import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { DeepPartial, FindConditions, FindManyOptions, FindOneOptions, ObjectLiteral, Repository } from 'typeorm';

export abstract class BasicCRUDService<T extends ObjectLiteral> {
    protected constructor(protected readonly repository: Repository<T>) {
    }

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
        return this.repository.findOneOrFail(id, options);
    }

    update: Repository<T>['update'] = (...args) => this.repository.update(...args);

    clear() {
        return this.repository.delete({});
    }
}

import { connect, Document, Model, Schema, SchemaDefinition, set } from 'mongoose';

import { dbURI } from '../config/consts';
import { logger } from '../utils/logger';

set('useFindAndModify', false);

connect(dbURI, { useNewUrlParser: true })
    .then(() => logger.info('Connected to MongoDB'))
    .catch((err) => logger.error(err.message));

export class RepositoryBase<T extends Document> {
    private readonly model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    create(item: object) {
        return new this.model(item);
    }

    async insert(item: T) {
        return await this.model.create(item);
    }

    async createAndInsert(item: object) {
        return await this.insert(this.create(item));
    }

    async query(condition: object) {
        return await this.model.find(condition);
    }

    async queryById(id: string) {
        return await this.model.findById(id);
    }

    async queryProtected(condition: object, field: string) {
        return await this.model.find(condition).populate(field);
    }

    async queryProtectedById(id: string, field: string) {
        return await this.model.findById(id).populate(field);
    }

    async update(condition: object, newItem: object, isRemove = false) {
        return await this.model.findOneAndUpdate(condition, { [isRemove ? '$unset' : '$set']: newItem }, { new: true });
    }

    async updateById(id: string, newItem: object, isRemove = false) {
        return await this.model.findByIdAndUpdate(id, { [isRemove ? '$unset' : '$set']: newItem }, { new: true });
    }

    async pushById(id: string, newItem: object) {
        return await this.model.findByIdAndUpdate(id, { $push: newItem }, { new: true });
    }

    async pullById(id: string, deleteItem: object) {
        return await this.model.findByIdAndUpdate(id, { $pull: deleteItem }, { new: true });
    }

    async delete(condition: object) {
        return await this.model.findOneAndDelete(condition);
    }

    async deleteById(id: string) {
        return await this.model.findByIdAndDelete(id);
    }

    async count(condition: object) {
        return await this.model.countDocuments(condition);
    }
}

export const createSchema = (definition: SchemaDefinition, withId = true) => new Schema(definition, {
    versionKey: false,
    _id: withId
});

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

    insert(item: T) {
        return this.model.create(item);
    }

    createAndInsert(item: object) {
        return this.insert(this.create(item));
    }

    query(condition: object) {
        return this.model.find(condition);
    }

    queryById(id: string) {
        return this.model.findById(id);
    }

    update(condition: object, newItem: object, isRemove = false) {
        return this.model.findOneAndUpdate(condition, { [isRemove ? '$unset' : '$set']: newItem }, { new: true });
    }

    updateById(id: string, newItem: object, isRemove = false) {
        return this.model.findByIdAndUpdate(id, { [isRemove ? '$unset' : '$set']: newItem }, { new: true });
    }

    pushById(id: string, newItem: object) {
        return this.model.findByIdAndUpdate(id, { $push: newItem }, { new: true });
    }

    pullById(id: string, deleteItem: object) {
        return this.model.findByIdAndUpdate(id, { $pull: deleteItem }, { new: true });
    }

    delete(condition: object) {
        return this.model.findOneAndDelete(condition);
    }

    deleteById(id: string) {
        return this.model.findByIdAndDelete(id);
    }

    count(condition: object) {
        return this.model.countDocuments(condition);
    }
}

export const createSchema = (definition: SchemaDefinition, withId = true) => new Schema(definition, {
    versionKey: false,
    _id: withId
});

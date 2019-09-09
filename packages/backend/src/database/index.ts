import { ClientSession, connect, Document, Model, Schema, SchemaDefinition, set } from 'mongoose';

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

    insert(item: T, session?: ClientSession) {
        return this.model.create(item, { session: session ? session : null });
    }

    createAndInsert(item: object, session?: ClientSession) {
        return this.insert(this.create(item), session);
    }

    query(condition: object, session?: ClientSession) {
        return this.model.find(condition).session(session ? session : null);
    }

    queryById(id: string, session?: ClientSession) {
        return this.model.findById(id).session(session ? session : null);
    }

    update(condition: object, newItem: object, session?: ClientSession, isRemove = false) {
        return this.model.findOneAndUpdate(condition, { [isRemove ? '$unset' : '$set']: newItem }, { new: true }).session(session ? session : null);
    }

    updateById(id: string, newItem: object, session?: ClientSession, isRemove = false) {
        return this.model.findByIdAndUpdate(id, { [isRemove ? '$unset' : '$set']: newItem }, { new: true }).session(session ? session : null);
    }

    pushById(id: string, newItem: object, session?: ClientSession) {
        return this.model.findByIdAndUpdate(id, { $push: newItem }, { new: true }).session(session ? session : null);
    }

    pullById(id: string, deleteItem: object, session?: ClientSession) {
        return this.model.findByIdAndUpdate(id, { $pull: deleteItem }, { new: true }).session(session ? session : null);
    }

    delete(condition: object, session?: ClientSession) {
        return this.model.findOneAndDelete(condition).session(session ? session : null);
    }

    deleteById(id: string, session?: ClientSession) {
        return this.model.findByIdAndDelete(id).session(session ? session : null);
    }

    count(condition: object) {
        return this.model.countDocuments(condition);
    }
}

export const createSchema = (definition: SchemaDefinition, withId = true) => new Schema(definition, {
    versionKey: false,
    _id: withId
});

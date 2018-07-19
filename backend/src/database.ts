import { MongoClient, ObjectId } from 'mongodb';

const url = require('../config').url;

// const candidates = require('./candidates');

class Database {
    constructor() {
        this.connect()
            .then(obj => obj.db.createCollection('candidates')
                .then(() => obj.db.createCollection('users')
                    .then(() => obj.db.createCollection('recruitments')
                        .then(() => obj.client.close))))
    }

    async connect() {
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        return { db: client.db('recruitment'), client };
    }

    async insert(collection: string, data: object) {
        const { db, client } = await this.connect();
        try {
            const result = await db.collection(collection).insertOne(data);
            await client.close();
            return result.insertedId;
        } catch (e) {
            await client.close();
            throw e;
        }
    }

    async query(collection: string, query: object) {
        const { db, client } = await this.connect();
        try {
            const result = await db.collection(collection).find(query).toArray();
            await client.close();
            return result;
        } catch (e) {
            await client.close();
            throw e;
        }
    }

    async delete(collection: string, id: string) {
        const { db, client } = await this.connect();
        try {
            await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
            await client.close();
        } catch (e) {
            await client.close();
            throw e;
        }
    }

    async update(collection: string, id: string, item: object, isRemove = false) {
        const { db, client } = await this.connect();
        try {
            await db.collection(collection).updateOne({ _id: new ObjectId(id) }, { [isRemove ? '$unset' : '$set']: item });
            await client.close();
        } catch (e) {
            await client.close();
            throw e;
        }
    }
}

export default Database;
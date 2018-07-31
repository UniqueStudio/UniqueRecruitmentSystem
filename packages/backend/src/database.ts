import { MongoClient } from 'mongodb';

const url = "mongodb://localhost:27017/recruitment";

class Database {
    constructor() {
        (async () => {
            const { db, client } = await this.connect();
            await db.createCollection('candidates');
            await db.createCollection('users');
            await db.createCollection('recruitments');
            await client.close();
        })()
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

    async query(collection: string, data: object) {
        const { db, client } = await this.connect();
        try {
            const result = await db.collection(collection).find(data).toArray();
            await client.close();
            return result;
        } catch (e) {
            await client.close();
            throw e;
        }
    }

    async delete(collection: string, data: object) {
        const { db, client } = await this.connect();
        try {
            await db.collection(collection).deleteOne(data);
            await client.close();
        } catch (e) {
            await client.close();
            throw e;
        }
    }

    async update(collection: string, data: object, item: object, isRemove = false) {
        const { db, client } = await this.connect();
        if (Object.values(item).includes(undefined)) {
            throw new Error('include undefined value');
        }
        try {
            await db.collection(collection).updateOne(data, { [isRemove ? '$unset' : '$set']: item });
            await client.close();
        } catch (e) {
            await client.close();
            throw e;
        }
    }
}

export default Database;
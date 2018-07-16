const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const candidates = require('./candidates');
const ObjectId = require('mongodb').ObjectId;

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

    async insert(collection, data) {
        const { db, client } = await this.connect();
        await db.collection(collection).insertMany(data);
        client.close();
    }

    async query(collection, query) {
        const { db, client } = await this.connect();
        const result = await db.collection(collection).find(query).toArray();
        const resultFormatted = [{}, {}, {}, {}, {}, {}];
        result.map(i => resultFormatted[i.step][i._id] = i);
        client.close();
        return resultFormatted;
    }

    async delete(collection, cid) {
        const { db, client } = await this.connect();
        await db.collection(collection).deleteOne({ '_id': ObjectId(cid) });
        client.close();
    }

    async update(collection, cid, item, isRemove = false) {
        const { db, client } = await this.connect();
        await db.collection(collection).updateOne({ '_id': ObjectId(cid) }, isRemove ? { $unset: item } : { $set: item });
        client.close();
    }
}

module.exports = Database;


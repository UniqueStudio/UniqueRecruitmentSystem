import redis from 'redis';
import { promisify } from 'util';
import { logger } from '../utils/logger';

const redisClient = redis.createClient({ host: 'redis' });
export const redisAsync = {
    get: promisify(redisClient.get).bind(redisClient),
    del: promisify(redisClient.del).bind(redisClient),
    set: promisify(redisClient.set).bind(redisClient),
    getThenDel: async (query: string) => {
        const result = await redisAsync.get(query);
        await redisAsync.del(query);
        return result;
    }
};
redisClient.on('error', logger.error);

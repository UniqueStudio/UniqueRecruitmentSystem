import IORedis from 'ioredis';

const redisClient = new IORedis({ host: 'redis' });

export const redisAsync = {
    ...redisClient,
    getThenDel: async (query: string) => {
        const result = await redisClient.get(query);
        await redisClient.del(query);
        return result;
    },
};

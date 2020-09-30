import { CronJob } from 'cron';
import mkdirp from 'mkdirp';
import { logger } from './utils/logger';

export const task = async () => {
    const directory = '/tmp/resumes';
    mkdirp.sync(directory);
    new CronJob('0 0 * * * *', async () => {
        try {
            // empty task
        } catch (error) {
            logger.error(error);
        }
    });
};

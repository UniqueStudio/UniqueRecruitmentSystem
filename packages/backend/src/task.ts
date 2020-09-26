import { CronJob } from 'cron';
import fs from 'fs';
import mkdirp from 'mkdirp';
import { join } from 'path';
import { promisify } from 'util';
import { logger } from './utils/logger';

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

export const task = async () => {
    const directory = '/tmp/resumes';
    mkdirp.sync(directory);
    new CronJob('0 0 * * * *', async () => {
        try {
            const files = await readdir(directory);
            const unlinkPromises = files.map((file) => unlink(join(directory, file)));
            await Promise.all(unlinkPromises);
        } catch (error) {
            logger.error(error);
        }
    });
};

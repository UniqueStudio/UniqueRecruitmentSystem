import { mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

import { CronJob } from 'cron';

import { logger } from '@utils/logger';

const directory = '/tmp/resumes';

export const cleaner = () => {
    mkdirSync(directory, { recursive: true });
    new CronJob('0 0 * * * *', () => {
        try {
            const files = readdirSync(directory);
            files.forEach((file) => unlinkSync(join(directory, file)));
            logger.info('pruned /tmp');
        } catch (error) {
            logger.error(error);
        }
    });
};

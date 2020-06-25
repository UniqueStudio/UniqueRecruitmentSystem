import crypto from 'crypto';

import { io, server } from './app';
import { loadConfig } from './config/acm';
import { UserRepo } from './database/model';
import { task } from './task';
import { isDev } from './utils/environment';
import { logger } from './utils/logger';
import { wsHandler } from './websocket';

loadConfig().catch((e) => logger.error(e));

const port = 5000;

server.listen(port, () => {
    logger.info(`Running in ${process.env.NODE_ENV}, port ${port}`);
});

wsHandler(io);

task().then(() => logger.info(`Task started`));

(async () => {
    if (isDev()) {
        const users = await UserRepo.query({ weChatID: 'foo' });
        if (!users.length) {
            const salt = crypto.randomBytes(16).toString('base64');
            const hash = crypto.scryptSync('P@ssw0rd', salt, 64).toString();
            await UserRepo.createAndInsert({
                weChatID: 'foo',
                username: 'w1nd3r1c4',
                joinTime: '2020C',
                phone: '19876543210',
                avatar: '',
                mail: 'foo@bar.com',
                isCaptain: true,
                isAdmin: true,
                gender: 0,
                group: 'web',
                password: {
                    salt,
                    hash
                }
            });
        }
    }
})();

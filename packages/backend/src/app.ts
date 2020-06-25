import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';

import { loadConfig } from './config/acm';
import { UserRepo } from './database/model';
import { jsonParser, urlencodedParser } from './middlewares/bodyParser';
import { cors } from './middlewares/cors';
import { errorHandler } from './middlewares/errorHandler';
import { infoLogger } from './middlewares/infoLogger';
import { routes } from './routes';
import { task } from './task';
import { isDev } from './utils/environment';
import { logger } from './utils/logger';
import { wsHandler, wsServer } from './websocket';

loadConfig().catch((e) => logger.error(e));

export const app = express();

app.use(urlencodedParser);

app.use(jsonParser);

app.use(cors);

app.use(infoLogger);

app.use(routes);

app.use(errorHandler);

export const server = isDev() ? http.createServer(app) : https.createServer({
    key: fs.readFileSync('uniqcert.key'),
    cert: fs.readFileSync('uniqcert.fullchain')
}, app);

export const io = wsServer(server);

wsHandler(io);

const port = 5000;

server.listen(port, () => {
    logger.info(`Running in ${process.env.NODE_ENV}, port ${port}`);
});

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

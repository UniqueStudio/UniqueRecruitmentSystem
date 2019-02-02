import express from 'express';
import fs from 'fs';
// import http from 'http';
import https from 'https';
import { jsonParser, urlencodedParser } from './middlewares/bodyParser';
import { cors } from './middlewares/cors';
import { errorHandler } from './middlewares/errorHandler';
import { infoLogger } from './middlewares/infoLogger';
import { validator } from './middlewares/validator';
import { routes } from './routes';
import { task } from './task';
import { logger } from './utils/logger';
import { wsHandler, wsServer } from './websocket';

export const app = express();

app.use(urlencodedParser);

app.use(jsonParser);

app.use(validator);

app.use(cors);

app.use(infoLogger);

app.use(routes);

app.use(errorHandler);

export const server = https.createServer({
    key: fs.readFileSync('/etc/v2ray/v2ray.key'),
    cert: fs.readFileSync('/etc/v2ray/v2ray.crt')
}, app);
// export const server = http.createServer(app);

export const io = wsServer(server);

wsHandler(io);

server.listen(5000);

task().then(() => logger.info('Task started'));

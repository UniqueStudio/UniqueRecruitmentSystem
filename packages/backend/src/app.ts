import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';

import { jsonParser, urlencodedParser } from './middlewares/bodyParser';
import { cors } from './middlewares/cors';
import { errorHandler } from './middlewares/errorHandler';
import { infoLogger } from './middlewares/infoLogger';
import { routes } from './routes';
import { isDev } from './utils/environment';
import { wsServer } from './websocket';

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

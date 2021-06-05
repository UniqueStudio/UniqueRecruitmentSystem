import fs from 'fs';
import http from 'http';
import https from 'https';

import express from 'express';

import { accessLoggers } from '@mw/accessLogger';
import { jsonParser, urlencodedParser } from '@mw/bodyParser';
import { cors } from '@mw/cors';
import { errorHandler } from '@mw/errorHandler';
import { routes } from '@routes/index';
import { isDev } from '@utils/environment';

export const app = express();

app.use(urlencodedParser);

app.use(jsonParser);

app.use(cors);

accessLoggers.forEach((accessLogger) => app.use(accessLogger));

app.use(routes);

app.use(errorHandler);

export const server = isDev ? http.createServer(app) : https.createServer({
    key: fs.readFileSync('uniqcert.key'),
    cert: fs.readFileSync('uniqcert.fullchain'),
}, app);

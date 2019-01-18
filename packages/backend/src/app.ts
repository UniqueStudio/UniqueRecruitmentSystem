import express from 'express';
import http from 'http';
// import https from 'https';
import { jsonParser, urlencodedParser } from './middlewares/bodyParser';
import { cors } from './middlewares/cors';
import { errorHandler } from './middlewares/errorHandler';
import { infoLogger } from './middlewares/infoLogger';
import { validator } from './middlewares/validator';
import { routes } from './routes';
import { task } from './task';
import { wsHandler, wsServer } from './websocket';

export const app = express();

app.use(urlencodedParser);

app.use(jsonParser);

app.use(validator);

app.use(cors);

app.use(infoLogger);

app.use(routes);

app.use(errorHandler);
// export const server = https.createServer({
//     key: fs.readFileSync('uniqcert.key'),
//     cert: fs.readFileSync('uniqcert.fullchain')
// }, app);
export const server = http.createServer(app);

export const io = wsServer(server);
wsHandler(io);

if (process.env.NODE_ENV !== 'test') {
    server.listen(5000);
}

task();

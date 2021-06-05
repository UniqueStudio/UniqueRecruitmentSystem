import { loadConfig } from '@config/acm';
import { server } from '@servers/http';
import { io, wsHandler } from '@servers/websocket';
import { tasks } from '@tasks/index';
import { logger } from '@utils/logger';

loadConfig().catch((e) => logger.error(e));

const port = 5000;

server.listen(port, () => {
    logger.info(`Running in ${process.env.NODE_ENV}, port ${port}`);
});

wsHandler(io);

tasks.forEach((task) => task());

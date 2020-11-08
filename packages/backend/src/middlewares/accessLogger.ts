import morgan from 'morgan';

import { logger } from '@utils/logger';

const format = ':remote-addr ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

export const infoLogger = morgan(format, {
    skip: (_req, res) => {
        return res.statusCode >= 400;
    },
    stream: {
        write: (message) => {
            logger.info(message.trim());
        }
    }
});

export const warnLogger = morgan(format, {
    skip: (_req, res) => {
        return res.statusCode < 400 || res.statusCode >= 500;
    },
    stream: {
        write: (message) => {
            logger.warn(message.trim());
        }
    }
});

export const errorLogger = morgan(format, {
    skip: (_req, res) => {
        return res.statusCode < 500;
    },
    stream: {
        write: (message) => {
            logger.error(message.trim());
        }
    }
});

export const accessLoggers = [infoLogger, warnLogger, errorLogger];

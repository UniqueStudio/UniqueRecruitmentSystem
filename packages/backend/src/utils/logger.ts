import { createLogger, format, transports } from 'winston';

import { isDev } from '@utils/environment';

export const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(({ level, message, timestamp }) => `[${level}] ${timestamp as string} | ${message}`),
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/access.log' }),
    ],
});

if (isDev) {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple(),
        ),
    }));
}

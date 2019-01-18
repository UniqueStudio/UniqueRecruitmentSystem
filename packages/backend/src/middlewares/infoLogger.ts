import { RequestHandler } from 'express';
import { logger } from '../utils/logger';

export const infoLogger: RequestHandler = (req, res, next) => {
    logger.info(`Requested ${req.url} from ${req.ip}`);
    next();
};

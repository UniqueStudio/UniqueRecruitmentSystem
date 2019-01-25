import { ErrorRequestHandler } from 'express';
import { logger } from '../utils/logger';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    const { message, type } = error;
    logger.error(message);
    res.json({ message, type: type || 'error' });
    next();
};

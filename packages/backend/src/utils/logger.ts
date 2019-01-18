import fs from 'fs';

const logInfo = fs.createWriteStream('./stdout.log');
const logError = fs.createWriteStream('./stderr.log');

export const logger = {
    info: (message: string) => {
        logInfo.write(`${new Date().toISOString()} [INFO] ${message}\n`);
    },
    error: (message: string) => {
        logError.write(`${new Date().toISOString()} [ERROR] ${message}\n`);
    }
};

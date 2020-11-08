import { CustomValidator } from 'express-validator';

export const checkInterview: CustomValidator = (interview) => {
    if (!interview) {
        return true;
    }
    if (!Array.isArray(interview)) {
        return false;
    }
    if (!interview.length) {
        return true;
    }
    return interview.filter(({ date, morning, afternoon, evening }) =>
        typeof date !== 'number'
        || typeof morning !== 'number'
        || typeof afternoon !== 'number'
        || typeof evening !== 'number',
    ).length === 0;
};

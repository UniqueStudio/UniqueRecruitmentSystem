import { createHash } from 'crypto';

export default (payload: object): string => {
    return createHash('md5')
        .update(JSON.stringify(payload))
        .digest('hex');
};

import { createHash } from 'crypto';

export default (payload: unknown): string => {
    return createHash('md5')
        .update(JSON.stringify(payload))
        .digest('hex');
};

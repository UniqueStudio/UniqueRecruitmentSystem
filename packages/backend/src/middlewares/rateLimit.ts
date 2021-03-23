import { NextFunction, Request, Response } from 'express';

class Store {
    hits = new Map<string, number>();

    constructor(window: number) {
        setInterval(() => this.hits.clear(), window).unref();
    }

    increment(key: string) {
        const value = this.hits.get(key);
        if (value) {
            this.hits.set(key, value + 1);
            return value + 1;
        } else {
            this.hits.set(key, 1);
            return 1;
        }
    }
}

export const rateLimit = (window: number, max: number) => {
    const store = new Store(window);

    return (req: Request, res: Response, next: NextFunction) => {
        if (store.increment(req.ip) > max) {
            return res.status(429).send('Too Many Requests');
        }
        return next();
    };
};

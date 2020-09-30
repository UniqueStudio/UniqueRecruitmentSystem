import fetch from 'node-fetch';
import { shortenURLAPI } from '@config/consts';
import { logger } from './logger';

interface IGenerateResponse {
    code: number;
    origin_url?: string;
    short_url?: string;
}

const HTTPRegExp = /^https?:\/\//i;

/**
 *
 * @param url
 * @description always return a URL
 */
export const shortenURL = async (url: string) => {
    try {
        const resp = await fetch(shortenURLAPI, {
            method: 'POST',
            body: JSON.stringify({ url }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const { code, short_url } = (await resp.json()) as IGenerateResponse;
        if (!short_url) {
            throw new Error(`API doesn't provide a short URL: ${code}`);
        }
        return short_url.replace(HTTPRegExp, '');
    } catch (e) {
        logger.error(e);
        return url; // return raw url anyway
    }
};

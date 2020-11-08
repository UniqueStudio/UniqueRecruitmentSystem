import { URLSearchParams } from 'url';

import fetch from 'node-fetch';

import { shortenURLAPI } from '@config/consts';

interface IAlAPIShortURLResp {
    code: number;
    msg: string;
    data: {
        type: number;
        long_url: string;
        short_url?: string;
    };
}

/**
 *
 * @param url
 * @description always return a URL
 * @see https://www.alapi.cn/doc/show/16.html
 */
export const shortenURL = async (url: string) => {
    try {
        const resp = await fetch(shortenURLAPI, {
            method: 'POST',
            body: new URLSearchParams({
                url,
                type: '1',
            }),
        });
        const {
            data: { short_url },
            msg,
        } = (await resp.json()) as IAlAPIShortURLResp;
        if (!short_url) {
            throw new Error(`API doesn't provide a short URL: ${msg}`);
        }
        return short_url;
    } catch (e) {
        console.log(e);
        return url; // return raw url anyway
    }
};

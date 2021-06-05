import fetch from 'node-fetch';

import { getQRCodeURL } from '@config/consts';
import { Handler } from '@config/types';

export const handleQR: Handler = async (req, res, next) => {
    try {
        const response = await fetch(getQRCodeURL);
        const html = await response.text();
        const key = /key ?: ?"\w+/.exec(html)![0].replace(/key ?: ?"/, '');
        res.json({ key, type: 'success' });
    } catch (error) {
        return next(error);
    }
};

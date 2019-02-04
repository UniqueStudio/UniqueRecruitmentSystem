import { RequestHandler } from 'express';
import fetch from 'node-fetch';
import { getQRCodeURL } from '../../config/consts';

export const handleQR: RequestHandler = async (req, res, next) => {
    try {
        const response = await fetch(getQRCodeURL);
        const html = await response.text();
        const key = html.match(/key ?: ?"\w+/)![0].replace(/key ?: ?"/, '');
        res.json({ key, type: 'success' });
    } catch (error) {
        return next(error);
    }
};

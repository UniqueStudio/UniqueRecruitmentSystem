import fetch from 'node-fetch';
import { getQRCodeURL } from '../../lib/consts';
import { Request, Response } from 'express';

export const handleLogin = (req: Request, res: Response) => {
    (async () => {
        try {
            const response = await fetch(getQRCodeURL);
            const html = await response.text();
            const key = html.match(/key ?: ?"\w+/)![0].replace(/key ?: ?"/, '');
            res.send({ key, type: 'success' })
        } catch (err) {
            res.send({ message: err.message, type: 'warning' });
        }
    })()
};
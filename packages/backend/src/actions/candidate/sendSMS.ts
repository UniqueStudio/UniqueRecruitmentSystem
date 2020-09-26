import fetch from 'node-fetch';
import { smsAPI, token } from '../../config/consts';

export const sendSMS = async (phone: string, body: { template: number, param_list: string[] }) => {
    const resp = await fetch(smsAPI, {
        method: 'POST',
        headers: {
            Token: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone,
            ...body
        })
    });
    const { code, message }: { code: number, message: string } = await resp.json();
    if (code !== 200) {
        throw new Error(`Error : ${message}`);
    }
};

import fetch from 'node-fetch';
import { smsAPI, token } from '../../config/consts';

export default async (phone: string, name: string, status: string) => {
    // {1}你好，您当前状态是{2}，请关注手机短信以便获取后续通知。
    const smsBody = { template: 96388, param_list: [name, status] };
    const resp = await fetch(smsAPI, {
        method: 'POST',
        headers: {
            Token: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone,
            ...smsBody
        })
    });
    const { code, message }: { code: number, message: string } = await resp.json();
    if (code !== 200) {
        throw new Error(`Error in ${name}: ${message}`);
    }
};

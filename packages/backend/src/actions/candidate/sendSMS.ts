import fetch from 'node-fetch';
import { Questions } from '../../config/acm';
import { smsAPI, token } from '../../config/consts';
import { logger } from '../../utils/logger';

// only be called at `addCandidate.ts`
export const sendQuestionSMS = async (phone: string, name: string, group: string) => {
    const uri: string | undefined = Questions[group];
    if (!uri) {
        logger.error(`Error in ${name}: no question for ${group}`);
        // {1}你好，您当前状态是{2}，请关注手机短信以便获取后续通知。
        await sendSMS(phone, { template: 96388, param_list: [name, '成功提交报名表单'] });
        return;
    }
    // {1}你好，你已成功报名，请前往 {2} 继续招新流程，并关注手机短信以便获取后续通知。
    await sendSMS(phone, { template: 96388, param_list: [name, uri] });
};

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
        throw new Error(`Error in ${name}: ${message}`);
    }
};

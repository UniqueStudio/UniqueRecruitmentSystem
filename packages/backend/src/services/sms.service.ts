import { Injectable } from '@nestjs/common';
import got from 'got';

import { ConfigService } from '@services/config.service';

@Injectable()
export class SMSService {
    constructor(private readonly configService: ConfigService) {}

    async sendSMS(phone: string, id: string, params: string[]) {
        if (this.configService.isNotProd) {
            console.log(phone, id, params);
            return;
        }
        console.log(phone, id, params);
        const { code, message } = await got
            .post(this.configService.smsURL, {
                headers: {
                    Token: this.configService.get('SMS_API_TOKEN'),
                },
                json: {
                    phone_number: phone,
                    template_id: id,
                    template_param_set: params,
                },
                // throwHttpErrors: false,
            })
            .json<{ code: number; message: string }>();
        if (code !== 200) {
            throw new Error(message);
        }
    }
}

import { Injectable } from '@nestjs/common';
import got from 'got';

import { AppConfigService } from '@services/config.service';

@Injectable()
export class SMSService {
    constructor(
        private readonly configService: AppConfigService,
    ) {
    }

    async sendSMS(phone: string, template: number, params: string[]) {
        if (this.configService.isDev) {
            console.log(params);
            return;
        }
        const res = await got.post(this.configService.smsURL, {
            headers: {
                Token: this.configService.get('SMS_API_TOKEN'),
            },
            json: {
                phone,
                template,
                param_list: params,
            },
        }).json<{ code: number; message: string }>();
        if (res.code !== 200) {
            throw new Error(res.message);
        }
    }
}

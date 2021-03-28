import { TextDecoder } from 'util';

import { Injectable } from '@nestjs/common';
import got from 'got';
import { createTransport, Transporter } from 'nodemailer';

import { Group } from '@constants/enums';
import { CandidateEntity } from '@entities/candidate.entity';
import { Questionnaire } from '@interfaces/questionnaire';
import { ConfigService } from '@services/config.service';

@Injectable()
export class EmailService {
    gbkDecoder = new TextDecoder('gbk');

    transporter: Transporter;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.transporter = createTransport(configService.emailConfig);
    }

    private async getQuestionnaires() {
        const endpoint = this.configService.acmEndpoint;
        const ip = (await got(endpoint).text()).split('\n')[0];
        const gbkBuffer = await got(this.configService.acmServer(ip), {
            headers: this.configService.acmHeaders,
        }).buffer();
        return JSON.parse(this.gbkDecoder.decode(gbkBuffer)) as Record<Group, Questionnaire>;
    }

    async sendEmail({ name, group, recruitment, mail }: CandidateEntity) {
        if (this.configService.isDev) {
            return;
        }
        const questionnaires = await this.getQuestionnaires();
        if (questionnaires?.[group]?.uri) {
            const { uri, description } = questionnaires[group];
            await this.transporter.sendMail({
                from: '联创团队<robot@mail.hustunique.com>',
                to: {
                    name,
                    address: mail,
                },
                subject: `联创团队${recruitment.name}报名成功通知`,
                // eslint-disable-next-line max-len
                html: `<title>联创团队${recruitment.name}</title><body style=background:#f6f6f6;font-family:sans-serif><div style='margin:20px auto;max-width:580px;padding:10px'><div style='padding:30px 20px;background:#fff;border-radius:16px'><h2 style=font-weight:400;margin-top:0>联创团队${recruitment.name}报名成功通知</h2><hr style='border:0;height:1px;background-image:linear-gradient(to right,#ccc,#aaa,#ccc)'><p>${name}，你好！<p>${description}</p><a href='${uri}' style='background:#3fa9f5;border-radius:5px;color:#fff;display:inline-block;font-weight:700;padding:12px 25px;text-decoration:none' target='_blank'>Join Us</a></div><p style=margin-top:10px;text-align:center;font-size:12px;color:#999>联创团队 | <a href='mailto:contact@hustunique.com' style=color:#999>Contact Us</a></div>`,
            });
        }
    }
}

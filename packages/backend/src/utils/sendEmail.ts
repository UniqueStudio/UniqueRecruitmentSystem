import { createTransport } from 'nodemailer';
// import { logger } from './logger';
const { EMAIL_PASS } = process.env;

const transport = createTransport({
    host: 'smtpdm.aliyun.com',
    port: 25,
    auth: {
        user: 'mail.hustunique.com',
        pass: EMAIL_PASS!
    },
    secure: false
});

interface Receiver {
    name: string;
    address: string;
}

export default async (to: Receiver[], url: string) => {
    const html = `<html></html>`;
    const message = {
        from: 'mail.hustunique.com',
        to,
        subject: '主题',
        html,
        // attachments: [{
        //     filename: './a.jpg',
        //     cid: 'a'
        // }]
    };
    try {
        const info = await transport.sendMail(message);
        console.info(info);
        // logger.info(info);
    } catch (e) {
        console.log(e);
        // logger.error(e);
    }
};

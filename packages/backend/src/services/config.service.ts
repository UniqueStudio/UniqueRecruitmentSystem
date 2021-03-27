import { Injectable } from '@nestjs/common';
import { ConfigService as DefaultConfigService } from '@nestjs/config';

import { QR_API, SMS_API, WX_API } from '@constants/consts';
import { Env } from '@constants/enums';

@Injectable()
export class ConfigService extends DefaultConfigService {
    constructor() {
        super();
    }

    get isDev() {
        return this.get<Env>('NODE_ENV') !== Env.prod;
    }

    get isMigration() {
        return this.get<Env>('NODE_ENV') === Env.migration;
    }

    get backupPath() {
        return this.get<string>('MIGRATION_BACKUP_PATH');
    }

    get jwtKey() {
        return this.get<string>('JWT_KEY')!;
    }

    get port() {
        return this.get<string>('PORT')!;
    }

    get resumePaths() {
        return {
            temporary: this.get<string>('RESUME_TEMPORARY_PATH')!,
            persistent: this.get<string>('RESUME_PERSISTENT_PATH')!,
        };
    }

    get qrInitURL() {
        const APP_ID = this.get<string>('APP_ID')!;
        const AGENT_ID = this.get<string>('AGENT_ID')!;
        const REDIRECT_URI = this.get<string>('REDIRECT_URI')!;
        return `${QR_API}/qrConnect?appid=${APP_ID}&agentid=${AGENT_ID}&redirect_uri=${REDIRECT_URI}`;
    }

    qrImgURL(key: string) {
        return `${QR_API}/qrImg?key=${key}`;
    }

    scanningURL(key: string) {
        return `${QR_API}/l/qrConnect?key=${key}`;
    }

    get accessTokenURL() {
        const CORP_ID = this.get<string>('CORP_ID')!;
        const CORP_SECRET = this.get<string>('CORP_SECRET')!;
        return `${WX_API}/gettoken?corpid=${CORP_ID}&corpsecret=${CORP_SECRET}`;
    }

    uidURL(accessToken: string, code: string) {
        return `${WX_API}/user/getuserinfo?access_token=${accessToken}&code=${code}`;
    }

    userInfoURL(accessToken: string, uid: string) {
        return `${WX_API}/user/get?access_token=${accessToken}&userid=${uid}`;
    }

    get smsURL() {
        return SMS_API;
    }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { QR_API, WX_API } from '@constants/consts';
import { Env } from '@constants/enums';

@Injectable()
export class AppConfigService extends ConfigService {
    constructor() {
        super();
    }

    get isDev() {
        return this.get('NODE_ENV') === Env.dev;
    }

    get qrCodeURL() {
        const APP_ID = this.get<string>('APP_ID')!;
        const AGENT_ID = this.get<string>('AGENT_ID')!;
        const REDIRECT_URI = this.get<string>('REDIRECT_URI')!;
        return `${QR_API}/qrConnect?appid=${APP_ID}&agentid=${AGENT_ID}&redirect_uri=${REDIRECT_URI}`;
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
}

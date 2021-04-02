import { createHmac } from 'crypto';

import { Injectable } from '@nestjs/common';
import { ConfigService as DefaultConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ACM_API, EMAIL_HOST, EMAIL_PORT, QR_API, SMS_API, WX_API } from '@constants/consts';
import { Env } from '@constants/enums';

@Injectable()
export class ConfigService extends DefaultConfigService {
    constructor() {
        super();
    }

    get isNotProd() {
        return this.get<Env>('NODE_ENV') !== Env.prod;
    }

    get isTest() {
        return this.get<Env>('NODE_ENV') === Env.test;
    }

    get isMigration() {
        return this.get<Env>('NODE_ENV') === Env.migration;
    }

    get backupPath() {
        return this.get<string>('MIGRATION_BACKUP_PATH');
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
        const APP_ID = this.get<string>('APP_ID')!;
        const CORP_SECRET = this.get<string>('CORP_SECRET')!;
        return `${WX_API}/gettoken?corpid=${APP_ID}&corpsecret=${CORP_SECRET}`;
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

    get acmEndpoint() {
        return `${ACM_API}:8080/diamond-server/diamond`;
    }

    acmServer(ip: string) {
        const DATA_ID = this.get<string>('ACM_DATA_ID')!;
        const GROUP = this.get<string>('ACM_GROUP')!;
        const NAMESPACE = this.get<string>('ACM_NAMESPACE')!;
        return `http://${ip}:8080/diamond-server/config.co?dataId=${DATA_ID}&group=${GROUP}&tenant=${NAMESPACE}`;
    }

    get acmHeaders() {
        const ACCESS_KEY = this.get<string>('ACM_ACCESS_KEY')!;
        const SECRET_KEY = this.get<string>('ACM_SECRET_KEY')!;
        const GROUP = this.get<string>('ACM_GROUP')!;
        const NAMESPACE = this.get<string>('ACM_NAMESPACE')!;
        const timestamp = Date.now();
        const signature = createHmac('sha1', SECRET_KEY).update(`${NAMESPACE}+${GROUP}+${timestamp}`).digest('base64');
        return {
            'Spas-AccessKey': ACCESS_KEY,
            'Spas-Signature': signature,
            timeStamp: timestamp.toString(),
        };
    }

    get emailConfig() {
        return {
            host: EMAIL_HOST,
            port: EMAIL_PORT,
            auth: {
                user: this.get<string>('EMAIL_USER')!,
                pass: this.get<string>('EMAIL_PASS')!,
            },
            secure: true,
        };
    }

    get postgresConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.get<string>('POSTGRES_HOST'),
            port: this.isTest ? this.get<number>('POSTGRES_PORT_TEST') : this.get<number>('POSTGRES_PORT'),
            username: this.get<string>('POSTGRES_USER'),
            password: this.get<string>('POSTGRES_PASSWORD'),
            database: this.get<string>('POSTGRES_DB'),
            synchronize: this.isNotProd,
            autoLoadEntities: true,
        };
    }

    get jwtConfig(): JwtModuleOptions {
        return {
            secret: this.get<string>('JWT_KEY'),
            signOptions: {
                expiresIn: '7 days',
            },
        };
    }

    get multerConfig(): MulterModuleOptions {
        return {
            limits: {
                fileSize: 104857600, // 100MB
            },
            dest: this.resumePaths.temporary,
        };
    }
}

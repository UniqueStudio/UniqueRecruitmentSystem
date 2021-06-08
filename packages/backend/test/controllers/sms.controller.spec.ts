import { INestApplication } from '@nestjs/common';
import { agent } from 'supertest';

import { Gender, Group } from '@constants/enums';
import { init } from '@test/utils/init';

describe('SMSController e2e', () => {
    let app: INestApplication;
    let memberJWT: string;
    const password = 'P@ssw0rd';

    beforeAll(async () => {
        const services = await init();
        ({ app } = services);
        const { membersService } = services;
        const { phone } = await membersService.hashPasswordAndCreate(
            {
                weChatID: 'hanyuu',
                name: 'hanyuu',
                joinTime: '2020C',
                phone: '19876543211',
                mail: 'hanyuu@hinami.zawa',
                gender: Gender.female,
                group: Group.web,
            },
            password,
        );
        const {
            body: { payload },
        } = await agent(app.getHttpServer()).post('/auth/member/login').send({ password, phone });
        memberJWT = payload;
    });

    describe('GET /sms/verification/candidate/:phone', () => {
        it('should return 200', async () => {
            await agent(app.getHttpServer()).get('/sms/verification/candidate/13344445555').expect(200);
        });
    });

    describe('GET /sms/verification/member', () => {
        describe('get code for member with valid credential', () => {
            it('should return 200', async () => {
                await agent(app.getHttpServer())
                    .get('/sms/verification/member')
                    .auth(memberJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
        describe('get code for member with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer()).get('/sms/verification/member').expect(403);
            });
        });
    });

    afterAll(() => app.close());
});

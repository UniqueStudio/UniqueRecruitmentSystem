import { INestApplication } from '@nestjs/common';
import { agent } from 'supertest';

import { Gender, Group } from '@constants/enums';
import { CandidateEntity } from '@entities/candidate.entity';
import { MemberEntity } from '@entities/member.entity';
import { init } from '@test/utils/init';

describe('AuthController e2e', () => {
    let app: INestApplication;
    let testMember: MemberEntity;
    let testCandidate: CandidateEntity;
    const password = 'P@ssw0rd';

    beforeAll(async () => {
        const services = await init();
        ({ app } = services);
        const { membersService, candidatesService } = services;
        testMember = await membersService.hashPasswordAndCreate(
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
        testCandidate = await candidatesService.hashPasswordAndCreate(
            {
                phone: '13344445555',
                name: 'rika',
                gender: Gender.female,
                mail: 'aa@bb.cc',
            },
            password,
        );
    });

    describe('POST /auth/member/login with valid credential', () => {
        it('should return jwt', async () => {
            await agent(app.getHttpServer())
                .post('/auth/member/login')
                .send({ password, phone: testMember.phone })
                .expect(201);
        });
    });

    describe('POST /auth/member/login with invalid credential', () => {
        it('should throw', async () => {
            await agent(app.getHttpServer())
                .post('/auth/member/login')
                .send({ password: 'fakePassword', phone: testMember.phone })
                .expect(401);
        });
    });

    describe('POST /auth/candidate/login', () => {
        it('should return jwt', async () => {
            await agent(app.getHttpServer())
                .post('/auth/candidate/login')
                .send({ phone: testCandidate.phone, password })
                .expect(201);
        });
    });

    afterAll(() => app.close());
});

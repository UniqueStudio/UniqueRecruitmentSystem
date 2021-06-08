import { INestApplication } from '@nestjs/common';
import { agent } from 'supertest';

import { Gender, Group } from '@constants/enums';
import { MemberEntity } from '@entities/member.entity';
import { init } from '@test/utils/init';

describe('MemberController e2e', () => {
    let app: INestApplication;
    let testMember: MemberEntity;
    let testAdmin: MemberEntity;
    let memberJWT: string;
    let adminJWT: string;
    const password = 'P@ssw0rd';

    beforeAll(async () => {
        const services = await init();
        ({ app } = services);
        const { membersService } = services;
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
        testAdmin = await membersService.hashPasswordAndCreate(
            {
                weChatID: 'rika',
                name: 'rika',
                joinTime: '2020C',
                phone: '19876543212',
                mail: 'rika@hinami.zawa',
                gender: Gender.female,
                group: Group.web,
                isAdmin: true,
            },
            password,
        );
        {
            const {
                body: { payload },
            } = await agent(app.getHttpServer()).post('/auth/member/login').send({ password, phone: testMember.phone });
            memberJWT = payload;
        }
        {
            const {
                body: { payload },
            } = await agent(app.getHttpServer()).post('/auth/member/login').send({ password, phone: testAdmin.phone });
            adminJWT = payload;
        }
    });

    describe('GET /members/me with valid credential', () => {
        it('should return member info', async () => {
            const {
                body: { payload },
            } = await agent(app.getHttpServer()).get('/members/me').auth(memberJWT, { type: 'bearer' }).expect(200);
            const { weChatID, comments, password } = payload;
            expect(weChatID).toBe(testMember.weChatID);
            expect(password).toBe(undefined);
            expect(comments).toBe(undefined);
        });
    });

    describe('GET /members/me with invalid credential', () => {
        it('should throw', async () => {
            await agent(app.getHttpServer()).get('/members/me').expect(403);
        });
    });

    describe('PUT /members/me with valid credential', () => {
        describe('update phone, mail and password', () => {
            it('should return 200', async () => {
                await agent(app.getHttpServer())
                    .put('/members/me')
                    .send({
                        phone: '13344445555',
                        mail: 'aa@bbb.cc',
                        password: 'newPassword',
                    })
                    .auth(memberJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
        describe('login again with new phone and password', () => {
            it('should return new jwt', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .post('/auth/member/login')
                    .send({ password: 'newPassword', phone: '13344445555' })
                    .expect(201);
                expect(payload).toBeDefined();
            });
        });
        describe('login again with old phone and password', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post('/auth/member/login')
                    .send({ password, phone: testMember.phone })
                    .expect(401);
            });
        });
    });

    describe('GET /members/group with valid credential', () => {
        it('should return group info', async () => {
            const {
                body: { payload },
            } = await agent(app.getHttpServer()).get('/members/group').auth(memberJWT, { type: 'bearer' }).expect(200);
            expect(payload).toHaveLength(2);
        });
    });

    describe('PUT /members/admin', () => {
        describe('set admins with member credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put('/members/admin')
                    .send({
                        mids: [testMember.id],
                    })
                    .auth(memberJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
        describe('set admins with admin credential', () => {
            it('should return new admins', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .put('/members/admin')
                    .send({
                        mids: [testMember.id],
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(1);
                expect(payload).toStrictEqual([testMember.id]);
            });
        });
        describe('now member is admin', () => {
            it('should return new admins', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .put('/members/admin')
                    .send({
                        mids: [testMember.id],
                    })
                    .auth(memberJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(1);
                expect(payload).toStrictEqual([testMember.id]);
            });
        });
    });

    afterAll(() => app.close());
});

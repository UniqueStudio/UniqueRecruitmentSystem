import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { agent } from 'supertest';

import { Gender, Group } from '@constants/enums';
import { UserEntity } from '@entities/user.entity';
import { AppModule } from '@modules/app.module';
import { UsersService } from '@services/users.service';

describe('UserController e2e', () => {
    let app: INestApplication;
    let testUser: UserEntity;
    let testAdmin: UserEntity;
    let userJWT: string;
    let adminJWT: string;
    const password = 'P@ssw0rd';

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = module.createNestApplication();
        await app.init();
        const usersService = module.get<UsersService>(UsersService);
        await usersService.clear();
        testUser = await usersService.hashPasswordAndCreate({
            weChatID: 'hanyuu',
            name: 'hanyuu',
            joinTime: '2020C',
            phone: '19876543211',
            mail: 'hanyuu@hinami.zawa',
            gender: Gender.female,
            group: Group.web,
        }, password);
        testAdmin = await usersService.hashPasswordAndCreate({
            weChatID: 'rika',
            name: 'rika',
            joinTime: '2020C',
            phone: '19876543212',
            mail: 'rika@hinami.zawa',
            gender: Gender.female,
            group: Group.web,
            isAdmin: true,
        }, password);
        {
            const { body: { payload } } = await agent(app.getHttpServer())
                .post('/auth/user/login')
                .send({ password, phone: testUser.phone });
            userJWT = payload;
        }
        {
            const { body: { payload } } = await agent(app.getHttpServer())
                .post('/auth/user/login')
                .send({ password, phone: testAdmin.phone });
            adminJWT = payload;
        }
    });

    describe('GET /users/me with valid credential', () => {
        it('should return user info', async () => {
            const { body: { payload } } = await agent(app.getHttpServer())
                .get('/users/me')
                .auth(userJWT, { type: 'bearer' })
                .expect(200);
            const { weChatID, comments, password } = payload;
            expect(weChatID).toBe(testUser.weChatID);
            expect(password).toBe(undefined);
            expect(comments).toBe(undefined);
        });
    });

    describe('GET /users/me with invalid credential', () => {
        it('should throw', async () => {
            await agent(app.getHttpServer())
                .get('/users/me')
                .expect(403);
        });
    });

    describe('PUT /users/me with valid credential', () => {
        describe('update phone, mail and password', () => {
            it('should return 200', async () => {
                await agent(app.getHttpServer())
                    .put('/users/me')
                    .send({
                        phone: '13344445555',
                        mail: 'aa@bbb.cc',
                        password: 'newPassword',
                    })
                    .auth(userJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
        describe('login again with new phone and password', () => {
            it('should return new jwt', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .post('/auth/user/login')
                    .send({ password: 'newPassword', phone: '13344445555' })
                    .expect(201);
                expect(payload).toBeDefined();
            });
        });
        describe('login again with old phone and password', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post('/auth/user/login')
                    .send({ password, phone: testUser.phone })
                    .expect(401);
            });
        });
    });

    describe('GET /users/group with valid credential', () => {
        it('should return group info', async () => {
            const { body: { payload } } = await agent(app.getHttpServer())
                .get('/users/group')
                .auth(userJWT, { type: 'bearer' })
                .expect(200);
            expect(payload).toHaveLength(2);
        });
    });

    describe('PUT /users/admin', () => {
        describe('set admins with user credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put('/users/admin')
                    .send([testUser.id])
                    .auth(userJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
        describe('set admins with admin credential', () => {
            it('should return new admins', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .put('/users/admin')
                    .send([testUser.id])
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(1);
                expect(payload).toStrictEqual([testUser.id]);
            });
        });
        describe('now user is admin', () => {
            it('should return new admins', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .put('/users/admin')
                    .send([testUser.id])
                    .auth(userJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(1);
                expect(payload).toStrictEqual([testUser.id]);
            });
        });
    });

    afterAll(() => app.close());
});

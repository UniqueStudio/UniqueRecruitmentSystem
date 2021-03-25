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
    let jwt: string;
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
        const { body } = await agent(app.getHttpServer())
            .post('/auth/user/login')
            .send({ password, phone: testUser.phone });
        const { payload } = body;
        jwt = payload;
    });

    describe('GET /users/me with valid credential', () => {
        it('should return user info', async () => {
            await agent(app.getHttpServer())
                .get('/users/me')
                .auth(jwt, { type: 'bearer' })
                .expect(200);
        });
    });

    afterAll(() => app.close());
});

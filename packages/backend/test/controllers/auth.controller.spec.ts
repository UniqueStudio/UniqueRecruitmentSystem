import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { agent } from 'supertest';

import { Gender, Group } from '@constants/enums';
import { UserEntity } from '@entities/user.entity';
import { AppModule } from '@modules/app.module';
import { UsersService } from '@services/users.service';

describe('AuthController e2e', () => {
    let app: INestApplication;
    let testUser: UserEntity;
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
    });

    describe('POST /auth/login with valid credential', () => {
        it('should return jwt', async () => {
            await agent(app.getHttpServer())
                .post('/auth/login')
                .send({ password, phone: testUser.phone })
                .expect(201);
        });
    });

    describe('POST /auth/login with invalid credential', () => {
        it('should throw', async () => {
            await agent(app.getHttpServer())
                .post('/auth/login')
                .send({ password: 'fakePassword', phone: testUser.phone })
                .expect(401);
        });
    });

    afterAll(() => app.close());
});

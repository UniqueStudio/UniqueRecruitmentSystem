import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { agent } from 'supertest';

import { Gender, Group } from '@constants/enums';
import { UserEntity } from '@entities/user.entity';
import { AppModule } from '@modules/app.module';
import { CandidatesService } from '@services/candidates.service';
import { CommentsService } from '@services/comments.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { UsersService } from '@services/users.service';

describe('SMSController e2e', () => {
    let app: INestApplication;
    let testUser: UserEntity;
    let userJWT: string;
    const password = 'P@ssw0rd';

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = module.createNestApplication();
        await app.init();
        const usersService = app.get(UsersService);
        const recruitmentsService = app.get(RecruitmentsService);
        const candidatesService = app.get(CandidatesService);
        const interviewsService = app.get(InterviewsService);
        const commentsService = app.get(CommentsService);
        await commentsService.clear();
        await candidatesService.clear();
        await interviewsService.clear();
        await recruitmentsService.clear();
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
        const { body: { payload } } = await agent(app.getHttpServer())
            .post('/auth/user/login')
            .send({ password, phone: testUser.phone });
        userJWT = payload;
    });

    describe('GET /sms/verification/candidate/:phone', () => {
        it('should return 200', async () => {
            await agent(app.getHttpServer())
                .get('/sms/verification/candidate/13344445555')
                .expect(200);
        });
    });

    describe('GET /sms/verification/user', () => {
        describe('get code for user with valid credential', () => {
            it('should return 200', async () => {
                await agent(app.getHttpServer())
                    .get('/sms/verification/user')
                    .auth(userJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
        describe('get code for user with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .get('/sms/verification/user')
                    .expect(403);
            });
        });
    });

    afterAll(() => app.close());
});

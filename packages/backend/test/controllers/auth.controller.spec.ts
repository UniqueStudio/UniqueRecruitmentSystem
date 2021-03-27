import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { agent } from 'supertest';

import { Gender, Grade, Group, Rank } from '@constants/enums';
import { CandidateEntity } from '@entities/candidate.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { UserEntity } from '@entities/user.entity';
import { AppModule } from '@modules/app.module';
import { CandidatesService } from '@services/candidates.service';
import { CommentsService } from '@services/comments.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { UsersService } from '@services/users.service';

describe('AuthController e2e', () => {
    let app: INestApplication;
    let testUser: UserEntity;
    let testCandidate: CandidateEntity;
    let testRecruitment: RecruitmentEntity;
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
        testRecruitment = await recruitmentsService.createAndSave({
            name: '2020C',
            beginning: new Date('1999'),
            end: new Date('2099'),
            deadline: new Date('2099'),
        });
        testUser = await usersService.hashPasswordAndCreate({
            weChatID: 'hanyuu',
            name: 'hanyuu',
            joinTime: '2020C',
            phone: '19876543211',
            mail: 'hanyuu@hinami.zawa',
            gender: Gender.female,
            group: Group.web,
        }, password);
        testCandidate = await candidatesService.createAndSave({
            phone: '13344445555',
            group: Group.web,
            recruitment: testRecruitment,
            name: 'rika',
            gender: Gender.female,
            grade: Grade.freshman,
            institute: 'test',
            major: 'test',
            rank: Rank.A,
            mail: 'aa@bb.cc',
            intro: 'no',
            isQuick: true,
            referrer: 'hanyuu',
        });
    });

    describe('POST /auth/user/login with valid credential', () => {
        it('should return jwt', async () => {
            await agent(app.getHttpServer())
                .post('/auth/user/login')
                .send({ password, phone: testUser.phone })
                .expect(201);
        });
    });

    describe('POST /auth/user/login with invalid credential', () => {
        it('should throw', async () => {
            await agent(app.getHttpServer())
                .post('/auth/user/login')
                .send({ password: 'fakePassword', phone: testUser.phone })
                .expect(401);
        });
    });

    describe('POST /auth/candidate/login', () => {
        it('should return jwt', async () => {
            await agent(app.getHttpServer())
                .post('/auth/candidate/login')
                .send({ phone: testCandidate.phone, code: '1234' })
                .expect(201);
        });
    });

    afterAll(() => app.close());
});

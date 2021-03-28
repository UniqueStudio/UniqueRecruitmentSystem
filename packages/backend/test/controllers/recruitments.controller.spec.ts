import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { agent } from 'supertest';

import { Gender, Group, Period } from '@constants/enums';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { UserEntity } from '@entities/user.entity';
import { AppModule } from '@modules/app.module';
import { CandidatesService } from '@services/candidates.service';
import { CommentsService } from '@services/comments.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { UsersService } from '@services/users.service';

describe('RecruitmentsController e2e', () => {
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

    describe('POST /recruitments', () => {
        describe('create new recruitment with valid credential', () => {
            it('should return success', async () => {
                await agent(app.getHttpServer())
                    .post('/recruitments')
                    .send({
                        name: '2020A',
                        beginning: new Date('1999'),
                        end: new Date('2099'),
                        deadline: new Date('2003'),
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(201);
            });
        });

        describe('create new recruitment with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post('/recruitments')
                    .auth(userJWT, { type: 'bearer' })
                    .expect(403);
            });
        });

        describe('create new recruitment with invalid data', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post('/recruitments')
                    .send({
                        name: '2020A',
                        beginning: 3,
                        end: 1,
                        deadline: 2,
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(400);
            });
        });
    });

    describe('GET /recruitments/pending', () => {
        it('should return pending recruitments', async () => {
            const { body: { payload } } = await agent(app.getHttpServer())
                .get('/recruitments/pending')
                .expect(200);
            expect(payload).toHaveLength(1);
        });
    });

    describe('GET /recruitments', () => {
        describe('get all recruitments with valid credential', () => {
            it('should return all recruitments', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .get('/recruitments')
                    .auth(userJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(1);
            });
        });

        describe('get all recruitments with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .get('/recruitments')
                    .expect(403);
            });
        });
    });

    describe('PUT /recruitments/:rid/interviews/:name', () => {
        let testRecruitment: RecruitmentEntity;
        describe('get id of pending recruitment', () => {
            it('should return success', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .get('/recruitments/pending')
                    .expect(200);
                [testRecruitment] = payload;
            });
        });

        describe('set recruitment interviews with valid credential', () => {
            it('should return success', async () => {
                await agent(app.getHttpServer())
                    .put(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .send({
                        interviews: [
                            {
                                date: new Date('2001'),
                                period: Period.morning,
                                slotNumber: 5,
                            },
                            {
                                date: new Date('2001'),
                                period: Period.evening,
                                slotNumber: 5,
                            },
                        ],
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
            });
        });

        describe('get recruitments', () => {
            it('should return recruitments with interviews', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .get('/recruitments')
                    .auth(userJWT, { type: 'bearer' })
                    .expect(200);
                const [{ interviews }] = payload;
                expect(interviews).toHaveLength(2);
            });
        });

        describe('set recruitment interviews with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .auth(userJWT, { type: 'bearer' })
                    .expect(403);
            });
        });

        describe('set recruitment interviews with invalid data', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .send({
                        interviews: [
                            {
                                date: new Date(2001),
                                period: Period.morning,
                                slotNumber: 5,
                            },
                            {
                                date: new Date(2001),
                                period: Period.morning,
                                slotNumber: -1,
                            },
                        ],
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(400);
            });
        });
    });

    describe('PUT /recruitments/:rid/schedule', () => {
        let testRecruitment: RecruitmentEntity;
        describe('get id of pending recruitment', () => {
            it('should return success', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .get('/recruitments/pending')
                    .expect(200);
                [testRecruitment] = payload;
            });
        });

        describe('set recruitment schedule with valid credential', () => {
            it('should return success', async () => {
                await agent(app.getHttpServer())
                    .put(`/recruitments/${testRecruitment.id}/schedule`)
                    .send({
                        beginning: new Date('1999'),
                        end: new Date('2007'),
                        deadline: new Date('2003'),
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
            });
        });

        describe('get pending recruitments', () => {
            it('should return an empty array', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .get('/recruitments/pending')
                    .expect(200);
                expect(payload).toHaveLength(0);
            });
        });

        describe('set recruitment schedule with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/recruitments/${testRecruitment.id}/schedule`)
                    .auth(userJWT, { type: 'bearer' })
                    .expect(403);
            });
        });

        describe('set recruitment schedule with invalid data', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/recruitments/${testRecruitment.id}/schedule`)
                    .send({
                        beginning: new Date('1999'),
                        end: new Date('1998'),
                        deadline: new Date('2003'),
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(400);
            });
        });
    });

    afterAll(() => app.close());
});

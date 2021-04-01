import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { agent } from 'supertest';

import { Gender, Grade, Group, Period, Rank } from '@constants/enums';
import { InterviewEntity } from '@entities/interview.entity';
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
    let candidatesService: CandidatesService;
    let interviewsService: InterviewsService;
    const password = 'P@ssw0rd';

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = module.createNestApplication();
        await app.init();
        const usersService = app.get(UsersService);
        const recruitmentsService = app.get(RecruitmentsService);
        candidatesService = app.get(CandidatesService);
        interviewsService = app.get(InterviewsService);
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

    describe('POST and PUT /recruitments/:rid/interviews/:name', () => {
        let testRecruitment: RecruitmentEntity;
        let interviews: InterviewEntity[];
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
                    .post(`/recruitments/${testRecruitment.id}/interviews/web`)
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
                    .expect(201);
            });
        });

        describe('get recruitments', () => {
            it('should return recruitments with interviews', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .get('/recruitments')
                    .auth(userJWT, { type: 'bearer' })
                    .expect(200);
                [{ interviews }] = payload;
                expect(interviews).toHaveLength(2);
            });
        });

        describe('set recruitment interviews with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .auth(userJWT, { type: 'bearer' })
                    .expect(403);
            });
        });

        describe('set recruitment interviews for another group', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post(`/recruitments/${testRecruitment.id}/interviews/ai`)
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
                    .expect(403);
            });
        });

        describe('set recruitment interviews with invalid data', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .send({
                        interviews: [
                            {
                                date: new Date(2001),
                                period: Period.morning,
                                slotNumber: 5,
                            },
                            {
                                date: new Date(2001),
                                period: Period.afternoon,
                                slotNumber: -1,
                            },
                        ],
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(400);
            });
            it('should also throw', async () => {
                await agent(app.getHttpServer())
                    .post(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .send({
                        interviews: [
                            {
                                date: new Date(2005),
                                period: Period.morning,
                                slotNumber: 5,
                            },
                            {
                                date: new Date(2005),
                                period: Period.morning,
                                slotNumber: 5,
                            },
                        ],
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(400);
            });
        });

        describe('update recruitment interviews with valid credential', () => {
            it('should return success', async () => {
                await agent(app.getHttpServer())
                    .put(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .send({
                        interviews: interviews.map((interview) => ({
                            ...interview,
                            slotNumber: 6,
                        })),
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
            });
        });

        describe('get recruitments', () => {
            it('should return recruitments with updated interviews', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .get('/recruitments')
                    .auth(userJWT, { type: 'bearer' })
                    .expect(200);
                [{ interviews }] = payload;
                interviews.forEach(({ slotNumber }) => expect(slotNumber).toBe(6));
            });
        });

        describe('create candidate and select slots', () => {
            it('should return success', async () => {
                await candidatesService.createAndSave({
                    name: 'foo',
                    phone: '13131111111',
                    mail: 'foo@bar.com',
                    group: Group.web,
                    gender: Gender.female,
                    grade: Grade.freshman,
                    recruitment: testRecruitment,
                    rank: Rank.A,
                    institute: 'cs',
                    major: 'cs',
                    intro: 'hi',
                    isQuick: false,
                    interviewSelections: await interviewsService.find(),
                });
            });
        });

        describe('update recruitment interview again', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .send({
                        interviews: interviews.map((interview) => ({
                            ...interview,
                            date: new Date(2099),
                        })),
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(400);
            });
        });

        describe('delete all the interviews', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .delete(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .send(interviews.map(({ id }) => id))
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(400);
            });
        });

        describe('remove all candidates', () => {
            it('should return success', async () => {
                await candidatesService.clear();
            });
        });

        describe('delete all the interviews again', () => {
            it('should return success', async () => {
                await agent(app.getHttpServer())
                    .delete(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .send(interviews.map(({ id }) => id))
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
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

import { INestApplication } from '@nestjs/common';
import { agent } from 'supertest';

import { Gender, Grade, Group, Period, Rank } from '@constants/enums';
import { InterviewEntity } from '@entities/interview.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { ApplicationsService } from '@services/applications.service';
import { CandidatesService } from '@services/candidates.service';
import { InterviewsService } from '@services/interviews.service';
import { init } from '@test/utils/init';

describe('RecruitmentsController e2e', () => {
    let app: INestApplication;
    let memberJWT: string;
    let adminJWT: string;
    let applicationsService: ApplicationsService;
    let candidatesService: CandidatesService;
    let interviewsService: InterviewsService;
    const password = 'P@ssw0rd';

    beforeAll(async () => {
        const services = await init();
        ({ app, applicationsService, candidatesService, interviewsService } = services);
        const { membersService } = services;
        {
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
        }
        {
            const { phone } = await membersService.hashPasswordAndCreate(
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
            const {
                body: { payload },
            } = await agent(app.getHttpServer()).post('/auth/member/login').send({ password, phone });
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
                await agent(app.getHttpServer()).post('/recruitments').auth(memberJWT, { type: 'bearer' }).expect(403);
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
            const {
                body: { payload },
            } = await agent(app.getHttpServer())
                .get('/recruitments/pending')
                .auth(memberJWT, { type: 'bearer' })
                .expect(200);
            expect(payload).toHaveLength(1);
        });
    });

    describe('GET /recruitments', () => {
        describe('get all recruitments with valid credential', () => {
            it('should return all recruitments', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get('/recruitments')
                    .auth(memberJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(1);
            });
        });

        describe('get all recruitments with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer()).get('/recruitments').expect(403);
            });
        });
    });

    describe('PUT /recruitments/:rid/interviews/:name', () => {
        let testRecruitment: RecruitmentEntity;
        let interviews: InterviewEntity[];
        describe('get id of pending recruitment', () => {
            it('should return success', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get('/recruitments/pending')
                    .auth(memberJWT, { type: 'bearer' })
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
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get('/recruitments')
                    .auth(memberJWT, { type: 'bearer' })
                    .expect(200);
                [{ interviews }] = payload;
                expect(interviews).toHaveLength(2);
            });
        });

        describe('set recruitment interviews with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .auth(memberJWT, { type: 'bearer' })
                    .expect(403);
            });
        });

        describe('set recruitment interviews for another group', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/recruitments/${testRecruitment.id}/interviews/ai`)
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
                    .put(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .send({
                        interviews: [
                            ...interviews,
                            {
                                date: new Date('2001'),
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
                    .put(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .send({
                        interviews: [
                            ...interviews,
                            {
                                date: new Date('2001'),
                                period: Period.evening,
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

        describe('get recruitments again', () => {
            it('should return recruitments with updated interviews', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get('/recruitments')
                    .auth(memberJWT, { type: 'bearer' })
                    .expect(200);
                [{ interviews }] = payload;
                interviews.forEach(({ slotNumber }) => {
                    expect(slotNumber).toBe(6);
                });
            });
        });

        describe('create candidate and select slots', () => {
            it('should return success', async () => {
                const candidate = await candidatesService.hashPasswordAndCreate({
                    name: 'foo',
                    phone: '13131111111',
                    mail: 'foo@bar.com',
                    gender: Gender.female,
                });
                expect(
                    await applicationsService.createAndSave({
                        group: Group.web,
                        grade: Grade.freshman,
                        candidate,
                        recruitment: testRecruitment,
                        rank: Rank.A,
                        institute: 'cs',
                        major: 'cs',
                        intro: 'hi',
                        isQuick: false,
                        interviewSelections: await interviewsService.find(),
                    }),
                ).toBeDefined();
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
                    .put(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .send({
                        interviews: [],
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(400);
            });
        });

        describe('remove all candidates', () => {
            it('should return success', async () => {
                expect(await applicationsService.clear()).toBeDefined();
            });
        });

        describe('delete all the interviews again', () => {
            it('should return success', async () => {
                await agent(app.getHttpServer())
                    .put(`/recruitments/${testRecruitment.id}/interviews/web`)
                    .send({
                        interviews: [],
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
    });

    describe('PUT /recruitments/:rid/schedule', () => {
        let testRecruitment: RecruitmentEntity;
        describe('get id of pending recruitment', () => {
            it('should return success', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get('/recruitments/pending')
                    .auth(memberJWT, { type: 'bearer' })
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
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get('/recruitments/pending')
                    .auth(memberJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(0);
            });
        });

        describe('set recruitment schedule with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/recruitments/${testRecruitment.id}/schedule`)
                    .auth(memberJWT, { type: 'bearer' })
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

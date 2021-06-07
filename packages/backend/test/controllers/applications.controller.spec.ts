import { INestApplication } from '@nestjs/common';
import { agent } from 'supertest';

import { Gender, Grade, Group, Period, Rank, Step } from '@constants/enums';
import { ApplicationEntity } from '@entities/application.entity';
import { InterviewEntity } from '@entities/interview.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { ApplicationsService } from '@services/applications.service';
import { init } from '@test/utils/init';

describe('ApplicationsController e2e', () => {
    let app: INestApplication;
    let prevRecruitment: RecruitmentEntity;
    let testRecruitment: RecruitmentEntity;
    let adminJWT: string;
    let candidateJWT: string;
    let testApplication: ApplicationEntity;
    let startTime: number;
    let applicationsService: ApplicationsService;
    const password = 'P@ssw0rd';

    beforeAll(async () => {
        startTime = new Date().getTime();
        const services = await init();
        ({ applicationsService, app } = services);
        const { recruitmentsService, membersService, candidatesService } = services;
        prevRecruitment = await recruitmentsService.createAndSave({
            name: '2018A',
            beginning: new Date('2018'),
            deadline: new Date('2019'),
            end: new Date('2020'),
        });
        // previous candidate
        await candidatesService.hashPasswordAndCreate(
            {
                name: 'foo',
                phone: '13131111111',
                mail: 'foo@bar.com',
                gender: Gender.female,
            },
            password,
        );
        await applicationsService.createAndSave({
            group: Group.web,
            grade: Grade.freshman,
            recruitment: prevRecruitment,
            rank: Rank.A,
            institute: 'cs',
            major: 'cs',
            intro: 'hi',
            isQuick: false,
        });
        // create user before create recruitment
        const { phone } = await membersService.hashPasswordAndCreate(
            {
                weChatID: 'hanyuu',
                name: 'hanyuu',
                joinTime: '2000C',
                phone: '19876543211',
                mail: 'hanyuu@hinami.zawa',
                gender: Gender.female,
                group: Group.ai,
                isAdmin: true,
            },
            password,
        );
        testRecruitment = await recruitmentsService.createAndSave({
            name: '2020C',
            beginning: new Date('1999'),
            deadline: new Date('2077'),
            end: new Date('2099'),
        });
        {
            const {
                body: { payload },
            } = await agent(app.getHttpServer()).post('/auth/member/login').send({ password, phone });
            adminJWT = payload;
        }
        {
            const {
                body: { payload },
            } = await agent(app.getHttpServer()).post('/auth/candidate/login').send({ phone: '13131111111', password });
            candidateJWT = payload;
        }
    });

    describe('POST /applications', () => {
        describe('create application without credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post('/applications')
                    .field('group', Group.web)
                    .field('rid', testRecruitment.id)
                    .field('grade', Grade.freshman)
                    .field('institute', 'test')
                    .field('major', 'test')
                    .field('rank', Rank.A)
                    .field('intro', 'no')
                    .field('isQuick', true)
                    .field('referrer', 'hanyuu')
                    .attach('resume', '/etc/hosts')
                    .expect(403);
            });
        });
        describe('create new application', () => {
            it('should return success', async () => {
                const {
                    body: {
                        payload,
                    },
                } = await agent(app.getHttpServer())
                    .post('/applications')
                    .field('group', Group.web)
                    .field('rid', testRecruitment.id)
                    .field('grade', Grade.freshman)
                    .field('institute', 'test')
                    .field('major', 'test')
                    .field('rank', Rank.A)
                    .field('intro', 'no')
                    .field('isQuick', true)
                    .field('referrer', 'hanyuu')
                    .attach('resume', '/etc/hosts')
                    .auth(candidateJWT, { type: 'bearer' })
                    .expect(201);
                testApplication = payload;
            });
        });
        describe('create the same application again', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post('/applications')
                    .field('group', Group.web)
                    .field('rid', testRecruitment.id)
                    .field('grade', Grade.freshman)
                    .field('institute', 'test')
                    .field('major', 'test')
                    .field('rank', Rank.A)
                    .field('intro', 'no')
                    .field('isQuick', true)
                    .field('referrer', 'hanyuu')
                    .attach('resume', '/etc/hosts')
                    .auth(candidateJWT, { type: 'bearer' })
                    .expect(400);
            });
        });

        describe('create new application with invalid data', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post('/applications')
                    .send({
                        group: -1,
                        rid: 2,
                        grade: -5,
                        institute: 6,
                        major: -7,
                        rank: 8,
                        intro: undefined,
                        isQuick: NaN,
                        referrer: [{}],
                    })
                    .auth(candidateJWT, { type: 'bearer' })
                    .expect(400);
            });
        });
    });

    describe('GET /applications/:aid', () => {
        it('should return application data', async () => {
            const {
                body: { payload },
            } = await agent(app.getHttpServer())
                .get(`/applications/${testApplication.id}`)
                .auth(candidateJWT, { type: 'bearer' })
                .expect(200);
            const { id, recruitment, comments } = payload;
            expect(id).toBeDefined();
            expect(recruitment).toBeUndefined();
            expect(comments).toBeUndefined();
        });
    });

    describe('PUT /applications/:aid', () => {
        describe('update application data with valid credential', () => {
            it('should return 200', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${testApplication.id}`)
                    .auth(candidateJWT, { type: 'bearer' })
                    .field('group', Group.ai)
                    .field('grade', Grade.graduate)
                    .field('institute', 'eee')
                    .field('major', 'ddd')
                    .field('rank', Rank.D)
                    .field('intro', 'ddd')
                    .field('isQuick', false)
                    .field('referrer', 'rika')
                    .attach('resume', '/etc/profile')
                    .expect(200);
            });
        });
        describe('get application data again', () => {
            it('should return new application data', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get(`/applications/${testApplication.id}`)
                    .auth(candidateJWT, { type: 'bearer' })
                    .expect(200);
                const { institute } = payload;
                expect(institute).toBe('eee');
            });
        });
        describe('update my info without credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer()).put('/applications/:aid').expect(403);
            });
        });
    });

    describe('GET /applications/:aid/resume', () => {
        describe('get resume with user credential', () => {
            it('should download the resume', async () => {
                const { body, header } = await agent(app.getHttpServer())
                    .get(`/applications/${testApplication.id}/resume`)
                    .auth(adminJWT, { type: 'bearer' })
                    .buffer()
                    .parse((res, callback) => {
                        res.setEncoding('binary');
                        let data = '';
                        res.on('data', (chunk: string) => {
                            data += chunk;
                        });
                        res.on('end', () => {
                            callback(null, Buffer.from(data, 'binary'));
                        });
                    })
                    .expect(200);
                expect(header).toHaveProperty('content-disposition');
                expect(body).toBeInstanceOf(Buffer);
            });
        });
        describe('get resume with candidate credential', () => {
            it('should download the resume', async () => {
                const { body, header } = await agent(app.getHttpServer())
                    .get(`/applications/${testApplication.id}/resume`)
                    .auth(candidateJWT, { type: 'bearer' })
                    .buffer()
                    .parse((res, callback) => {
                        res.setEncoding('binary');
                        let data = '';
                        res.on('data', (chunk: string) => {
                            data += chunk;
                        });
                        res.on('end', () => {
                            callback(null, Buffer.from(data, 'binary'));
                        });
                    })
                    .expect(200);
                expect(header).toHaveProperty('content-disposition');
                expect(body).toBeInstanceOf(Buffer);
            });
        });
        describe('get resume without credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer()).get(`/applications/${testApplication.id}/resume`).expect(403);
            });
        });
    });

    describe('GET /applications/recruitment/:rid', () => {
        describe('get applications with valid credential', () => {
            it('should return the applications info', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get(`/applications/recruitment/${testRecruitment.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(1);
            });
        });
        describe('get applications with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer()).get(`/applications/recruitment/${testRecruitment.id}`).expect(403);
            });
        });
        describe('get applications with invalid rid', () => {
            it('should throw 400', async () => {
                await agent(app.getHttpServer())
                    .get('/applications/recruitment/foo')
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(400);
            });
        });
        describe('get applications with updated at', () => {
            it('should return empty', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get(`/applications/recruitment/${testRecruitment.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .query({ updatedAt: new Date().getTime() }) // add this updatedAt query
                    .expect(200);
                expect(payload).toHaveLength(0);
            });

            it('should return updated applications', async () => {
                // update test application
                await applicationsService.update(testApplication.id, { institute: 'newName' });

                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get(`/applications/recruitment/${testRecruitment.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .query({ updatedAt: startTime }) // add this updatedAt query
                    .expect(200);
                expect(payload).toHaveLength(1);
                const [{ institute }] = payload;
                expect(institute).toBe('newName');
            });

            it('should get 400 with invalid updatedAt', async () => {
                await agent(app.getHttpServer())
                    .get(`/applications/recruitment/${testRecruitment.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .query({ updatedAt: 'foo' }) // add this updatedAt query
                    .expect(400);
            });
        });

        describe('get applications in previous recruitment than user', () => {
            it('should throw 403', async () => {
                await agent(app.getHttpServer())
                    .get(`/applications/recruitment/${prevRecruitment.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
    });

    describe('PUT /applications/:cid/interview/:type', () => {
        const time = new Date();
        describe('move all applications to interview step', () => {
            it('should success', async () => {
                expect(await applicationsService.update({}, { step: Step.组面时间选择 })).toBeDefined();
            });
        });
        describe('allocate interview for an application with valid credential', () => {
            it('should return 200', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${testApplication.id}/interview/group`)
                    .send({
                        time,
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
        describe('get his group interview', () => {
            it('should be allocated', async () => {
                const {
                    interviewAllocations: { group },
                } = await applicationsService.findOneById(testApplication.id);
                expect(group).toStrictEqual(time);
            });
        });
    });

    describe('GET and PUT /applications/:aid/slots/:type', () => {
        describe('prepare interview slots', () => {
            it('should return success', async () => {
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
                    .expect(200);
            });
        });
        let interviews: InterviewEntity[];
        describe('get my slots', () => {
            it('should return my slots', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get(`/applications/${testApplication.id}/slots/group`)
                    .auth(candidateJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(2);
                interviews = payload;
            });
        });
        describe('select slots', () => {
            it('should return success', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${testApplication.id}/slots/group`)
                    .send({
                        iids: interviews.map(({ id }) => id),
                    })
                    .auth(candidateJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
        describe('select slots again', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${testApplication.id}/slots/group`)
                    .send({
                        iids: interviews.map(({ id }) => id),
                    })
                    .auth(candidateJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
        describe('get his selection', () => {
            it('should be equal to what he selected', async () => {
                const { interviewSelections } = await applicationsService.findOneByIdForMember(testApplication.id);
                expect(interviewSelections).toHaveLength(2);
            });
        });
    });

    describe('PUT /applications/interview/:type', () => {
        describe('automatically allocate interview for applications with valid credential', () => {
            it('should return 200', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .put('/applications/interview/group')
                    .send({
                        aids: [testApplication.id],
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(1);
            });
        });
    });

    afterAll(() => app.close());
});

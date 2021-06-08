import { INestApplication } from '@nestjs/common';
import { agent } from 'supertest';

import { Gender, Grade, Group, Period, Rank, Role, Step } from '@constants/enums';
import { ApplicationEntity } from '@entities/application.entity';
import { InterviewEntity } from '@entities/interview.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { ApplicationsService } from '@services/applications.service';
import { init } from '@test/utils/init';

describe('ApplicationsController e2e', () => {
    let app: INestApplication;
    let prevRecruitment: RecruitmentEntity;
    let recruitment: RecruitmentEntity;
    let adminJWT: string;
    let aliceJWT: string;
    let bobJWT: string;
    let aliceApplication: ApplicationEntity;
    let bobApplication: ApplicationEntity;
    let applicationsService: ApplicationsService;

    beforeAll(async () => {
        const services = await init();
        ({ applicationsService, app } = services);
        const { authService, recruitmentsService, membersService, candidatesService } = services;
        prevRecruitment = await recruitmentsService.createAndSave({
            name: '2018A',
            beginning: new Date('1000'),
            deadline: new Date('1001'),
            end: new Date('1002'),
        });
        // admin joins us before `recruitment` but after `prevRecruitment`
        const admin = await membersService.hashPasswordAndCreate({
            weChatID: 'hanyuu',
            name: 'hanyuu',
            joinTime: '2000C',
            phone: '19876543211',
            mail: 'hanyuu@hinami.zawa',
            gender: Gender.female,
            group: Group.design,
            isAdmin: true,
        });
        const alice = await candidatesService.hashPasswordAndCreate({
            name: 'alice',
            phone: '13131111111',
            mail: 'foo@bar.com',
            gender: Gender.female,
        });
        const bob = await candidatesService.hashPasswordAndCreate({
            name: 'bob',
            phone: '13131111112',
            mail: 'bar@bar.com',
            gender: Gender.female,
        });
        // previous application
        await applicationsService.createAndSave({
            group: Group.web,
            grade: Grade.freshman,
            candidate: alice,
            recruitment: prevRecruitment,
            rank: Rank.A,
            institute: 'cs',
            major: 'cs',
            intro: 'hi',
            isQuick: false,
        });
        recruitment = await recruitmentsService.createAndSave({
            name: '2020C',
            beginning: new Date('1999'),
            deadline: new Date('2077'),
            end: new Date('2099'),
        });
        bobApplication = await applicationsService.createAndSave({
            group: Group.web,
            grade: Grade.freshman,
            candidate: bob,
            recruitment: recruitment,
            rank: Rank.A,
            institute: 'cs',
            major: 'cs',
            intro: 'hi',
            isQuick: false,
        });
        adminJWT = await authService.generateToken(admin.id, Role.member);
        aliceJWT = await authService.generateToken(alice.id, Role.candidate);
        bobJWT = await authService.generateToken(bob.id, Role.candidate);
    });

    describe('POST /applications', () => {
        describe('create application without credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post('/applications')
                    .field('group', Group.web)
                    .field('rid', recruitment.id)
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
                    .field('rid', recruitment.id)
                    .field('grade', Grade.freshman)
                    .field('institute', 'test')
                    .field('major', 'test')
                    .field('rank', Rank.A)
                    .field('intro', 'no')
                    .field('isQuick', true)
                    .field('referrer', 'hanyuu')
                    .attach('resume', '/etc/hosts')
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(201);
                aliceApplication = payload;
            });
        });
        describe('create the same application again', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post('/applications')
                    .field('group', Group.web)
                    .field('rid', recruitment.id)
                    .field('grade', Grade.freshman)
                    .field('institute', 'test')
                    .field('major', 'test')
                    .field('rank', Rank.A)
                    .field('intro', 'no')
                    .field('isQuick', true)
                    .field('referrer', 'hanyuu')
                    .attach('resume', '/etc/hosts')
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(400);
            });
        });
        describe('create application to ended recruitment', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post('/applications')
                    .field('group', Group.web)
                    .field('rid', prevRecruitment.id)
                    .field('grade', Grade.freshman)
                    .field('institute', 'test')
                    .field('major', 'test')
                    .field('rank', Rank.A)
                    .field('intro', 'no')
                    .field('isQuick', true)
                    .field('referrer', 'hanyuu')
                    .attach('resume', '/etc/hosts')
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(403);
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
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(400);
            });
        });
    });

    describe('GET /applications/:aid', () => {
        describe('get own application data as alice', () => {
            it('should return partial application data', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get(`/applications/${aliceApplication.id}`)
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(200);
                const { id, recruitment, comments } = payload;
                expect(id).toBeDefined();
                expect(recruitment).toBeUndefined();
                expect(comments).toBeUndefined();
            });
        });
        describe('get application data of bob as alice', () => {
            it('should return partial application data', async () => {
                await agent(app.getHttpServer())
                    .get(`/applications/${bobApplication.id}`)
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
        describe('get application data as member', () => {
            it('should return full application data', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get(`/applications/${aliceApplication.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
                const { id, recruitment, comments } = payload;
                expect(id).toBeDefined();
                expect(recruitment).toBeDefined();
                expect(comments).toBeDefined();
            });
        });
    });

    describe('PUT /applications/:aid', () => {
        describe('update application data with valid credential', () => {
            it('should return 200', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${aliceApplication.id}`)
                    .auth(aliceJWT, { type: 'bearer' })
                    .field('group', Group.design)
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
                    .get(`/applications/${aliceApplication.id}`)
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(200);
                const { institute } = payload;
                expect(institute).toBe('eee');
            });
        });
        describe('update own info without credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer()).put('/applications/:aid').expect(403);
            });
        });
        describe('update info of bob with credential of alice', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${bobApplication.id}`)
                    .auth(aliceJWT, { type: 'bearer' })
                    .field('group', Group.ai)
                    .field('grade', Grade.graduate)
                    .field('institute', 'eee')
                    .field('major', 'ddd')
                    .field('rank', Rank.D)
                    .field('intro', 'ddd')
                    .field('isQuick', false)
                    .field('referrer', 'rika')
                    .attach('resume', '/etc/profile')
                    .expect(403);
            });
        });
        describe('apply to design without resume', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${aliceApplication.id}`)
                    .auth(aliceJWT, { type: 'bearer' })
                    .field('group', Group.design)
                    .field('grade', Grade.graduate)
                    .field('institute', 'eee')
                    .field('major', 'ddd')
                    .field('rank', Rank.D)
                    .field('intro', 'ddd')
                    .field('isQuick', false)
                    .field('referrer', 'rika')
                    .expect(403);
            });
        });
    });

    describe('PUT /applications/:aid/abandoned', () => {
        describe('abandon application with valid credential', () => {
            it('should return 200', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${bobApplication.id}/abandoned`)
                    .auth(bobJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
        describe('get application data', () => {
            it('should return application data with abandoned=true', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get(`/applications/${bobApplication.id}`)
                    .auth(bobJWT, { type: 'bearer' })
                    .expect(200);
                const { abandoned } = payload;
                expect(abandoned).toBe(true);
            });
        });
        describe('abandon application info without credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${bobApplication.id}/abandoned`)
                    .expect(403);
            });
        });
        describe('abandon again', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${bobApplication.id}/abandoned`)
                    .auth(bobJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
        describe('abandon the application of alice with the credential of bob', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${aliceApplication.id}/abandoned`)
                    .auth(bobJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
    });

    describe('GET /applications/:aid/resume', () => {
        describe('get resume with member credential', () => {
            it('should download the resume', async () => {
                const { body, header } = await agent(app.getHttpServer())
                    .get(`/applications/${aliceApplication.id}/resume`)
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
            it('should also download the resume', async () => {
                const { body, header } = await agent(app.getHttpServer())
                    .get(`/applications/${aliceApplication.id}/resume`)
                    .auth(aliceJWT, { type: 'bearer' })
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
                await agent(app.getHttpServer()).get(`/applications/${aliceApplication.id}/resume`).expect(403);
            });
        });
        describe('get resume of bob with credential of alice', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .get(`/applications/${bobApplication.id}/resume`)
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
    });

    describe('GET /applications/recruitment/:rid', () => {
        describe('get applications with valid credential', () => {
            it('should return the applications info', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get(`/applications/recruitment/${recruitment.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(2);
            });
        });
        describe('get applications without credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer()).get(`/applications/recruitment/${recruitment.id}`).expect(403);
            });
        });
        describe('get applications with credential of alice', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .get(`/applications/recruitment/${recruitment.id}`)
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(403);
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
        describe('get applications with `updatedAt`', () => {
            it('should return empty', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get(`/applications/recruitment/${recruitment.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .query({ updatedAt: new Date().getTime() }) // add this updatedAt query
                    .expect(200);
                expect(payload).toHaveLength(0);
            });

            it('should return updated applications', async () => {
                const timeBeforeUpdate = Date.now();
                // update application of alice
                await applicationsService.update(aliceApplication.id, { institute: 'newName' });

                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get(`/applications/recruitment/${recruitment.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .query({ updatedAt: timeBeforeUpdate }) // add this updatedAt query
                    .expect(200);
                expect(payload).toHaveLength(1);
                expect(payload).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: aliceApplication.id,
                            institute: 'newName',
                        }),
                    ]),
                );
            });

            it('should get 400 with invalid updatedAt', async () => {
                await agent(app.getHttpServer())
                    .get(`/applications/recruitment/${recruitment.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .query({ updatedAt: 'foo' }) // add this updatedAt query
                    .expect(400);
            });
        });

        describe('get applications in `prevRecruitment`', () => {
            it('should throw 403', async () => {
                await agent(app.getHttpServer())
                    .get(`/applications/recruitment/${prevRecruitment.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
    });

    describe('PUT /applications/:aid/step', () => {
        describe('move alice with valid credential', () => {
            it('should return success', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${aliceApplication.id}/step`)
                    .send({
                        from: aliceApplication.step,
                        to: Step.通过,
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
        describe('move alice again with the same body', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${aliceApplication.id}/step`)
                    .send({
                        from: aliceApplication.step,
                        to: Step.通过,
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(400);
            });
        });
        describe('move alice without credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${aliceApplication.id}/step`)
                    .send({
                        from: Step.通过,
                        to: Step.通过,
                    })
                    .expect(403);
            });
        });
        describe('move alice on her own', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${aliceApplication.id}/step`)
                    .send({
                        from: Step.通过,
                        to: Step.通过,
                    })
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
    });

    describe('GET and PUT /applications/:aid/slots/:type', () => {
        describe('prepare interview slots', () => {
            it('should return success', async () => {
                await applicationsService.update({}, { step: Step.组面时间选择 });
                await agent(app.getHttpServer())
                    .put(`/recruitments/${recruitment.id}/interviews/design`)
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
                    .get(`/applications/${aliceApplication.id}/slots/group`)
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(2);
                interviews = payload;
            });
        });
        describe('select slots', () => {
            it('should return success', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${aliceApplication.id}/slots/group`)
                    .send({
                        iids: [interviews[0].id],
                    })
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
        describe('select slots again', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${aliceApplication.id}/slots/group`)
                    .send({
                        iids: interviews.map(({ id }) => id),
                    })
                    .auth(aliceJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
        describe('get her selection', () => {
            it('should be equal to what she selected', async () => {
                const { interviewSelections } = await applicationsService.findOneByIdForMember(aliceApplication.id);
                expect(interviewSelections).toHaveLength(1);
                expect(interviewSelections).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: interviews[0].id,
                        }),
                    ]),
                );
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
                        aids: [aliceApplication.id],
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(1);
            });
        });
        describe('allocate interview for abandoned candidates', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put('/applications/interview/group')
                    .send({
                        aids: [aliceApplication.id, bobApplication.id],
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
    });

    describe('PUT /applications/:cid/interview/:type', () => {
        const time = new Date();
        describe('allocate interview for an application with valid credential', () => {
            it('should return 200', async () => {
                await agent(app.getHttpServer())
                    .put(`/applications/${aliceApplication.id}/interview/group`)
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
                } = await applicationsService.findOneById(aliceApplication.id);
                expect(group).toStrictEqual(time);
            });
        });
    });

    describe('DELETE /applications/:aid/', () => {
        describe('remove alice with valid credential', () => {
            it('should return success', async () => {
                await agent(app.getHttpServer())
                    .delete(`/applications/${aliceApplication.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
        describe('get applications again', () => {
            it('should not return the application of alice', async () => {
                const {
                    body: { payload },
                } = await agent(app.getHttpServer())
                    .get(`/applications/recruitment/${recruitment.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(1);
                const [{ id }] = payload;
                expect(id).not.toEqual(aliceApplication.id);
            });
        });
        describe('remove alice without credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .delete(`/applications/${aliceApplication.id}`)
                    .expect(403);
            });
        });
    });

    afterAll(() => app.close());
});

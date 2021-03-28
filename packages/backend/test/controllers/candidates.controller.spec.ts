import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { agent } from 'supertest';

import { Gender, Grade, Group, Period, Rank, Step } from '@constants/enums';
import { CandidateEntity } from '@entities/candidate.entity';
import { InterviewEntity } from '@entities/interview.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { UserEntity } from '@entities/user.entity';
import { AppModule } from '@modules/app.module';
import { CandidatesService } from '@services/candidates.service';
import { CommentsService } from '@services/comments.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { UsersService } from '@services/users.service';

describe('CandidatesController e2e', () => {
    let app: INestApplication;
    let testUser: UserEntity;
    let testRecruitment: RecruitmentEntity;
    let adminJWT: string;
    let candidateJWT: string;
    let testCandidate: CandidateEntity;
    let candidatesService: CandidatesService;
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
            deadline: new Date('2048'),
        });
        testUser = await usersService.hashPasswordAndCreate({
            weChatID: 'hanyuu',
            name: 'hanyuu',
            joinTime: '2000C',
            phone: '19876543211',
            mail: 'hanyuu@hinami.zawa',
            gender: Gender.female,
            group: Group.ai,
            isAdmin: true,
        }, password);
        const { body: { payload } } = await agent(app.getHttpServer())
            .post('/auth/user/login')
            .send({ password, phone: testUser.phone });
        adminJWT = payload;
    });

    describe('POST /candidates', () => {
        describe('create new candidate', () => {
            it('should return success', async () => {
                await agent(app.getHttpServer())
                    .post('/candidates')
                    .field('phone', '13344445555')
                    .field('group', Group.web)
                    .field('rid', testRecruitment.id)
                    .field('name', 'rika')
                    .field('gender', Gender.female)
                    .field('grade', Grade.freshman)
                    .field('institute', 'test')
                    .field('major', 'test')
                    .field('rank', Rank.A)
                    .field('mail', 'aa@bb.cc')
                    .field('intro', 'no')
                    .field('isQuick', true)
                    .field('referrer', 'hanyuu')
                    .attach('resume', '/etc/hosts')
                    .expect(201);
            });
        });

        describe('create new candidate with invalid data', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .post('/candidates')
                    .send({
                        phone: '0',
                        group: -1,
                        rid: 2,
                        name: -3,
                        gender: 4,
                        grade: -5,
                        institute: 6,
                        major: -7,
                        rank: 8,
                        mail: -9,
                        intro: undefined,
                        isQuick: NaN,
                        referrer: [{}],
                    })
                    .expect(400);
            });
        });

        describe('candidate login', () => {
            it('should return jwt', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .post('/auth/candidate/login')
                    .send({ phone: '13344445555', code: '1234' })
                    .expect(201);
                candidateJWT = payload;
            });
        });
    });

    describe('GET /candidates/me', () => {
        it('should return my data', async () => {
            const { body: { payload } } = await agent(app.getHttpServer())
                .get('/candidates/me')
                .auth(candidateJWT, { type: 'bearer' })
                .expect(200);
            testCandidate = payload;
            const { id, resume, interviewSelections, recruitment } = payload;
            expect(id).toBeDefined();
            expect(resume).toBeUndefined();
            expect(interviewSelections).toBeUndefined();
            expect(recruitment).toBeUndefined();
        });
    });

    describe('PUT /candidates/me', () => {
        describe('update my info with valid credential', () => {
            it('should return 200', async () => {
                await agent(app.getHttpServer())
                    .put('/candidates/me')
                    .auth(candidateJWT, { type: 'bearer' })
                    .field('group', Group.ai)
                    .field('name', 'hanyuu')
                    .field('gender', Gender.other)
                    .field('grade', Grade.graduate)
                    .field('institute', 'ddd')
                    .field('major', 'ddd')
                    .field('rank', Rank.D)
                    .field('mail', 'aa@bb.cc')
                    .field('intro', 'ddd')
                    .field('isQuick', false)
                    .field('referrer', 'rika')
                    .attach('resume', '/etc/profile')
                    .expect(200);
            });
        });
        describe('get my new info', () => {
            it('should return my new info', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .get('/candidates/me')
                    .auth(candidateJWT, { type: 'bearer' })
                    .expect(200);
                const { name } = payload;
                expect(name).toBe('hanyuu');
            });
        });
        describe('update my info with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put('/candidates/me')
                    .expect(403);
            });
        });
    });

    describe('GET /candidates/:cid/resume', () => {
        describe('get resume with valid credential', () => {
            it('should download the resume', async () => {
                const { body, header } = await agent(app.getHttpServer())
                    .get(`/candidates/${testCandidate.id}/resume`)
                    .auth(adminJWT, { type: 'bearer' })
                    .buffer()
                    .parse((res, callback) => {
                        res.setEncoding('binary');
                        let data = '';
                        res.on('data', (chunk) => {
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
        describe('get resume with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .get(`/candidates/${testCandidate.id}/resume`)
                    .expect(403);
            });
        });
    });

    describe('GET /candidates/recruitment/:rid', () => {
        describe('get candidates with valid credential', () => {
            it('should return the candidates info', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .get(`/candidates/recruitment/${testRecruitment.id}`)
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(1);
            });
        });
        describe('get candidates with invalid credential', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .get(`/candidates/recruitment/${testRecruitment.id}`)
                    .expect(403);
            });
        });
    });

    describe('PUT /candidates/:cid/interview/:type', () => {
        const time = new Date();
        describe('move all candidates to interview step', () => {
            it('should success', async () => {
                await candidatesService.update({}, { step: Step.组面时间选择 });
            });
        });
        describe('allocate interview for a candidate with valid credential', () => {
            it('should return 200', async () => {
                await agent(app.getHttpServer())
                    .put(`/candidates/${testCandidate.id}/interview/group`)
                    .send({
                        time,
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
        describe('get his group interview', () => {
            it('should be allocated', async () => {
                const { interviewAllocations: { group } } = (await candidatesService.findOneById(testCandidate.id))!;
                expect(group).toStrictEqual(time);
            });
        });
    });

    describe('GET and PUT /candidates/me/slots', () => {
        describe('prepare interview slots', () => {
            it('should return success', async () => {
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
                    .expect(201);
            });
        });
        let interviews: InterviewEntity[];
        describe('get my slots', () => {
            it('should return my slots', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .get('/candidates/me/slots')
                    .auth(candidateJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(2);
                interviews = payload;
            });
        });
        describe('select slots', () => {
            it('should return success', async () => {
                await agent(app.getHttpServer())
                    .put('/candidates/me/slots')
                    .send({
                        iids: interviews.map(({ id }) => id),
                        abandon: false,
                    })
                    .auth(candidateJWT, { type: 'bearer' })
                    .expect(200);
            });
        });
        describe('select slots again', () => {
            it('should throw', async () => {
                await agent(app.getHttpServer())
                    .put('/candidates/me/slots')
                    .send({
                        iids: interviews.map(({ id }) => id),
                        abandon: false,
                    })
                    .auth(candidateJWT, { type: 'bearer' })
                    .expect(403);
            });
        });
        describe('get his selection', () => {
            it('should be equal to what he selected', async () => {
                const { interviewSelections } = (await candidatesService.findOneById(testCandidate.id))!;
                expect(interviewSelections).toHaveLength(2);
            });
        });
    });

    describe('PUT /candidates/interview/:type', () => {
        describe('automatically allocate interview for candidates with valid credential', () => {
            it('should return 200', async () => {
                const { body: { payload } } = await agent(app.getHttpServer())
                    .put('/candidates/interview/group')
                    .send({
                        cids: [testCandidate.id],
                    })
                    .auth(adminJWT, { type: 'bearer' })
                    .expect(200);
                expect(payload).toHaveLength(1);
            });
        });
    });

    afterAll(() => app.close());
});

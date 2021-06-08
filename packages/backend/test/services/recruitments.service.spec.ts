import { INestApplication } from '@nestjs/common';

import { Gender, Grade, Group, Rank } from '@constants/enums';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { ApplicationsService } from '@services/applications.service';
import { CandidatesService } from '@services/candidates.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { init } from '@test/utils/init';

describe('RecruitmentsService', () => {
    let app: INestApplication;
    let recruitmentsService: RecruitmentsService;
    let applicationsService: ApplicationsService;
    let candidatesService: CandidatesService;
    beforeAll(async () => {
        const services = await init();
        ({ app, recruitmentsService, applicationsService, candidatesService } = services);
    });

    let testRecruitment: RecruitmentEntity;

    describe('create valid recruitment', () => {
        it('should succeed', async () => {
            testRecruitment = await recruitmentsService.createAndSave({
                name: '2020C',
                beginning: new Date('1999'),
                end: new Date('2099'),
                deadline: new Date('2048'),
            });
            expect(testRecruitment).toBeDefined();
        });
    });

    describe('find pending recruitments', () => {
        it('should return a non-empty array', async () => {
            const recruitments = await recruitmentsService.findPending();
            expect(recruitments).toHaveLength(1);
        });
    });

    describe('find recruitments with statistics', () => {
        it('should return with statistics array', async () => {
            const candidate = await candidatesService.hashPasswordAndCreate({
                phone: '13344445555',
                name: 'rika',
                gender: Gender.female,
                mail: 'aa@bb.cc',
            });
            await applicationsService.createAndSave({
                group: Group.web,
                recruitment: testRecruitment,
                candidate,
                grade: Grade.freshman,
                institute: 'test',
                major: 'test',
                rank: Rank.A,
                intro: 'no',
                isQuick: true,
                referrer: 'hanyuu',
            });
            const recruitments = await recruitmentsService.findAllWithStatistics();
            recruitments.forEach(({ statistics }) => {
                expect(statistics).toHaveProperty(Group.web);
            });
        });
    });

    afterAll(() => app.close());
});

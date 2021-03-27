import { Test } from '@nestjs/testing';

import { Gender, Grade, Group, Rank } from '@constants/enums';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { AppModule } from '@modules/app.module';
import { CandidatesService } from '@services/candidates.service';
import { RecruitmentsService } from '@services/recruitments.service';

describe('RecruitmentsService', () => {
    let recruitmentsService: RecruitmentsService;
    let candidatesService: CandidatesService;
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        recruitmentsService = module.get<RecruitmentsService>(RecruitmentsService);
        candidatesService = module.get<CandidatesService>(CandidatesService);
        await candidatesService.clear();
        await recruitmentsService.clear();
    });

    let testRecruitment: RecruitmentEntity;

    describe('create valid recruitment', () => {
        it('should succeed', async () => {
            testRecruitment = await recruitmentsService.createAndSave({
                name: '2020C',
                beginning: new Date('1999'),
                end: new Date('2099'),
                deadline: new Date('2099'),
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
        it('should return with statistics array',  async () => {
            await candidatesService.createAndSave({
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
            const recruitments = await recruitmentsService.findWithStatistics();
            recruitments.forEach(({ statistics }) => expect(statistics).toHaveProperty(Group.web));
        });
    });

    afterAll(async () => {
        await candidatesService.clear();
        await recruitmentsService.clear();
    });
});

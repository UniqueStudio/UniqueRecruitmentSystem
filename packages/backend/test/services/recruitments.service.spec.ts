import { Test } from '@nestjs/testing';

import { RecruitmentEntity } from '@entities/recruitment.entity';
import { AppModule } from '@modules/app.module';
import { RecruitmentsService } from '@services/recruitments.service';

describe('RecruitmentsService', () => {
    let recruitmentsService: RecruitmentsService;
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        recruitmentsService = module.get<RecruitmentsService>(RecruitmentsService);
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
            expect(recruitments.length).toBeGreaterThan(0);
        });
    });

    describe('find recruitments with statistics', () => {
        it('should return with statistics array',  async () => {
            const recruitments = await recruitmentsService.findWithStatistics();
            recruitments.forEach(({ statistics }) => expect(statistics).toHaveProperty('length'));
        });
    });

    afterAll(async () => {
        await recruitmentsService.clear();
    });
});

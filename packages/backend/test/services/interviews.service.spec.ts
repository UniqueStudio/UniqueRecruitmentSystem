import { Test } from '@nestjs/testing';

import { GroupOrTeam, Period } from '@constants/enums';
import { InterviewEntity } from '@entities/interview.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { AppModule } from '@modules/app.module';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';

describe('RecruitmentsService', () => {
    let interviewsService: InterviewsService;
    let recruitmentsService: RecruitmentsService;
    let testRecruitment: RecruitmentEntity;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        interviewsService = module.get<InterviewsService>(InterviewsService);
        recruitmentsService = module.get<RecruitmentsService>(RecruitmentsService);
        await interviewsService.clear();
        await recruitmentsService.clear();
        testRecruitment = await recruitmentsService.createAndSave({
            name: '2020C',
            beginning: new Date('1999'),
            end: new Date(),
            deadline: new Date('2099'),
        });
    });

    let testInterview: InterviewEntity;

    describe('create valid interview', () => {
        it('should succeed', async () => {
            testInterview = await interviewsService.createAndSave({
                date: new Date(),
                period: Period.morning,
                name: GroupOrTeam.web,
                slotNumber: 100,
                recruitment: testRecruitment,
            });
            expect(testInterview).toBeDefined();
        });
    });

    afterAll(async () => {
        await interviewsService.clear();
        await recruitmentsService.clear();
    });
});

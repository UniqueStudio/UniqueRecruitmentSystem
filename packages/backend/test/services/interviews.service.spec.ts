import { Test } from '@nestjs/testing';

import { GroupOrTeam, Period } from '@constants/enums';
import { InterviewEntity } from '@entities/interview.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { AppModule } from '@modules/app.module';
import { CandidatesService } from '@services/candidates.service';
import { CommentsService } from '@services/comments.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { UsersService } from '@services/users.service';

describe('InterviewsService', () => {
    let interviewsService: InterviewsService;
    let recruitmentsService: RecruitmentsService;
    let testRecruitment: RecruitmentEntity;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        const usersService = module.get(UsersService);
        recruitmentsService = module.get(RecruitmentsService);
        const candidatesService = module.get(CandidatesService);
        interviewsService = module.get(InterviewsService);
        const commentsService = module.get(CommentsService);
        await commentsService.clear();
        await candidatesService.clear();
        await interviewsService.clear();
        await recruitmentsService.clear();
        await usersService.clear();
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

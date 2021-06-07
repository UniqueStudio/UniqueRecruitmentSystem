import { INestApplication } from '@nestjs/common';

import { GroupOrTeam, Period } from '@constants/enums';
import { InterviewEntity } from '@entities/interview.entity';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { init } from '@test/utils/init';

describe('InterviewsService', () => {
    let app: INestApplication;
    let interviewsService: InterviewsService;
    let recruitmentsService: RecruitmentsService;

    beforeAll(async () => {
        const services = await init();
        ({ app, recruitmentsService, interviewsService } = services);
    });

    let testInterview: InterviewEntity;

    describe('create valid interview', () => {
        it('should succeed', async () => {
            testInterview = await interviewsService.createAndSave({
                date: new Date(),
                period: Period.morning,
                name: GroupOrTeam.web,
                slotNumber: 100,
                recruitment: await recruitmentsService.createAndSave({
                    name: '2020C',
                    beginning: new Date('1999'),
                    end: new Date('2099'),
                    deadline: new Date('2048'),
                }),
            });
            expect(testInterview).toBeDefined();
        });
    });

    afterAll(() => app.close());
});

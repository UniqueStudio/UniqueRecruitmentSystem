import { Test } from '@nestjs/testing';

import { Gender, Grade, Group, Rank } from '@constants/enums';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { AppModule } from '@modules/app.module';
import { CandidatesService } from '@services/candidates.service';
import { CommentsService } from '@services/comments.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { UsersService } from '@services/users.service';

describe('RecruitmentsService', () => {
    let recruitmentsService: RecruitmentsService;
    let candidatesService: CandidatesService;
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        const usersService = module.get(UsersService);
        recruitmentsService = module.get(RecruitmentsService);
        candidatesService = module.get(CandidatesService);
        const interviewsService = module.get(InterviewsService);
        const commentsService = module.get(CommentsService);
        await commentsService.clear();
        await candidatesService.clear();
        await interviewsService.clear();
        await recruitmentsService.clear();
        await usersService.clear();
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
            const recruitments = await recruitmentsService.findAllWithStatistics();
            recruitments.forEach(({ statistics }) => expect(statistics).toHaveProperty(Group.web));
        });
    });

    afterAll(async () => {
        await candidatesService.clear();
        await recruitmentsService.clear();
    });
});

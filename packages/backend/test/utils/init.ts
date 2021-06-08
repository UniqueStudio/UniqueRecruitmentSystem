import { Test } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import { ApplicationsService } from '@services/applications.service';
import { AuthService } from '@services/auth.service';
import { CandidatesService } from '@services/candidates.service';
import { CommentsService } from '@services/comments.service';
import { InterviewsService } from '@services/interviews.service';
import { MembersService } from '@services/members.service';
import { RecruitmentsService } from '@services/recruitments.service';

export const init = async () => {
    const module = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const membersService = app.get(MembersService);
    const recruitmentsService = app.get(RecruitmentsService);
    const applicationsService = app.get(ApplicationsService);
    const candidatesService = app.get(CandidatesService);
    const interviewsService = app.get(InterviewsService);
    const commentsService = app.get(CommentsService);
    const authService = app.get(AuthService);
    await commentsService.clear();
    await applicationsService.clear();
    await candidatesService.clear();
    await interviewsService.clear();
    await recruitmentsService.clear();
    await membersService.clear();
    return {
        app,
        membersService,
        recruitmentsService,
        applicationsService,
        candidatesService,
        interviewsService,
        commentsService,
        authService,
    };
};

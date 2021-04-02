import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';

import { GroupOrTeam, Role } from '@constants/enums';
import { AcceptRole } from '@decorators/role.decorator';
import { User } from '@decorators/user.decorator';
import {
    CreateRecruitmentBody,
    SetRecruitmentInterviewsBody,
    SetRecruitmentScheduleBody,
} from '@dtos/recruitment.dto';
import { InterviewEntity } from '@entities/interview.entity';
import { UserEntity } from '@entities/user.entity';
import { RecruitmentsGateway } from '@gateways/recruitments.gateway';
import { CodeGuard } from '@guards/code.guard';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';

@Controller('recruitments')
export class RecruitmentsController {
    constructor(
        private readonly recruitmentsGateway: RecruitmentsGateway,
        private readonly recruitmentsService: RecruitmentsService,
        private readonly interviewsService: InterviewsService,
    ) {
    }

    @Get('pending')
    getPendingRecruitments() {
        return this.recruitmentsService.findPending();
    }

    @Get()
    @AcceptRole(Role.user)
    getAllRecruitments() {
        return this.recruitmentsService.findWithStatistics();
    }

    @Post()
    @AcceptRole(Role.admin)
    @UseGuards(CodeGuard)
    async createRecruitment(
        @Body() { name, beginning, end, deadline }: CreateRecruitmentBody,
    ) {
        const recruitment = await this.recruitmentsService.createAndSave({
            name,
            beginning: new Date(beginning),
            end: new Date(end),
            deadline: new Date(deadline),
        });
        this.recruitmentsGateway.broadcastUpdate(recruitment.id);
    }

    @Put(':rid/schedule')
    @AcceptRole(Role.admin)
    async setRecruitmentSchedule(
        @Param('rid') rid: string,
        @Body() { beginning, end, deadline }: SetRecruitmentScheduleBody,
    ) {
        const recruitment = await this.recruitmentsService.findOneById(rid);
        if (+recruitment.end < Date.now()) {
            /*
              * If somebody extends the end date, he can bypass the restrictions on many operations,
              * and may change some data of previous recruitments/candidates.
              * They are recommended to modify the end date BEFORE it comes.
              */
            throw new ForbiddenException('This recruitment has already ended. '
                + 'If you want to extend the end date of this recruitment, please contact maintainers. '
                + 'This is not a bug.',
            );
        }
        recruitment.beginning = new Date(beginning);
        recruitment.end = new Date(end);
        recruitment.deadline = new Date(deadline);
        await recruitment.save();
        this.recruitmentsGateway.broadcastUpdate(rid);
    }

    @Put(':rid/interviews/:name')
    @AcceptRole(Role.admin)
    async setRecruitmentInterviews(
        @User() user: UserEntity,
        @Param('rid') rid: string,
        @Param('name') name: GroupOrTeam,
        @Body() { interviews }: SetRecruitmentInterviewsBody,
    ) {
        const recruitment = await this.recruitmentsService.findOneById(rid);
        if (+recruitment.end < Date.now()) {
            throw new ForbiddenException('This recruitment has already ended');
        }
        if (name !== GroupOrTeam.unique && GroupOrTeam[user.group] !== name) {
            throw new ForbiddenException(`You cannot update interviews for group ${name}`);
        }
        const errors = new Set<string>();
        const updatedInterviews = new Map<string, Pick<InterviewEntity, 'date' | 'period' | 'slotNumber'>>();
        const newInterviews: Pick<InterviewEntity, 'date' | 'period' | 'slotNumber'>[] = [];
        for (const { id, date, period, slotNumber } of interviews) {
            if (id) {
                updatedInterviews.set(id, { date: new Date(date), period, slotNumber });
            } else {
                newInterviews.push({ date: new Date(date), period, slotNumber });
            }
        }
        for (const interview of await this.interviewsService.findManyWithCandidates(rid, name)) {
            const updatedInterview = updatedInterviews.get(interview.id);
            try {
                if (updatedInterview) {
                    const { date, period, slotNumber } = updatedInterview;
                    if (interview.candidates.length && (+interview.date !== +date || interview.period !== period)) {
                        errors.add('Some of the interview slots are already selected by candidates');
                    } else {
                        interview.slotNumber = slotNumber;
                        interview.date = date;
                        interview.period = period;
                        await interview.save();
                    }
                } else {
                    if (interview.candidates.length) {
                        errors.add('Some of the interview slots are already selected by candidates');
                    } else {
                        await interview.remove();
                    }
                }
            } catch ({ message }) {
                errors.add(message);
            }
        }
        for (const { date, period, slotNumber } of newInterviews) {
            try {
                await this.interviewsService.createAndSave({
                    date,
                    period,
                    name,
                    slotNumber,
                    recruitment,
                });
            } catch ({ message }) {
                errors.add(message);
            }
        }
        this.recruitmentsGateway.broadcastUpdate(rid);
        if (errors.size) {
            throw new BadRequestException([...errors].join(', '));
        }
    }
}

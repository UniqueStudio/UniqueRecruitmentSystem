import { BadRequestException, Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';

import { GroupOrTeam, Role } from '@constants/enums';
import { AcceptRole } from '@decorators/role.decorator';
import { CreateRecruitmentBody, SetRecruitmentInterviewsBody, SetRecruitmentScheduleBody } from '@dtos/recruitment.dto';
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
    async getPendingRecruitments() {
        return await this.recruitmentsService.findPending();
    }

    @Get()
    @AcceptRole(Role.user)
    async getAllRecruitments() {
        return await this.recruitmentsService.find();
    }

    @Get(':rid')
    @AcceptRole(Role.user)
    async getOneRecruitment(@Param('rid') rid: string) {
        return await this.recruitmentsService.findOneById(rid);
    }

    @Post()
    @AcceptRole(Role.admin)
    @UseGuards(CodeGuard)
    async createRecruitment(
        @Body() { name, begin, end, stop }: CreateRecruitmentBody,
    ) {
        await this.recruitmentsService.createAndSave({
            name,
            begin: new Date(begin),
            end: new Date(end),
            stop: new Date(stop),
        });
        this.recruitmentsGateway.broadcastUpdate();
    }

    @Put(':rid/schedule')
    @AcceptRole(Role.admin)
    async setRecruitmentSchedule(
        @Param('rid') rid: string,
        @Body() { begin, end, stop }: SetRecruitmentScheduleBody,
    ) {
        const recruitment = await this.recruitmentsService.findOneById(rid);
        if (!recruitment) {
            throw new BadRequestException(`Recruitment ${rid} does not exist`);
        }
        recruitment.begin = new Date(begin);
        recruitment.end = new Date(end);
        recruitment.stop = new Date(stop);
        await recruitment.save();
        this.recruitmentsGateway.broadcastUpdate();
    }

    @Put(':rid/interviews/:name')
    @AcceptRole(Role.admin)
    async setRecruitmentInterviews(
        @Param('rid') rid: string,
        @Param('name') name: GroupOrTeam,
        @Body() body: SetRecruitmentInterviewsBody[],
    ) {
        const recruitment = await this.recruitmentsService.findOneById(rid);
        if (!recruitment) {
            throw new BadRequestException(`Recruitment ${rid} does not exist`);
        }
        await this.interviewsService.saveMany(body.map(({ date, period, slotNumber }) => ({
            date: new Date(date),
            period,
            name,
            slotNumber,
            recruitment,
        })));
        this.recruitmentsGateway.broadcastUpdate();
    }
}

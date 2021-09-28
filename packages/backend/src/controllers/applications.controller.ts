import { join } from 'path';

import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Response } from 'express';

import { SLOTS, STEP_MAP, SMS_TEMPLATE_MAP } from '@constants/consts';
import { Group, GroupOrTeam, InterviewType, Role, Step, SMSTemplateType } from '@constants/enums';
import { Msg } from '@constants/messages';
import { Candidate } from '@decorators/candidate.decorator';
import { Member } from '@decorators/member.decorator';
import { AcceptRole } from '@decorators/role.decorator';
import {
    Aid,
    AllocateManyBody,
    AllocateManyParams,
    AllocateOneBody,
    CreateApplicationBody,
    InterviewParams,
    MoveApplicationBody,
    Rid,
    SelectInterviewSlotsBody,
    SetApplicationBody,
} from '@dtos/application.dto';
import { ApplicationEntity } from '@entities/application.entity';
import { CandidateEntity } from '@entities/candidate.entity';
import { MemberEntity } from '@entities/member.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';
import { ApplicationsGateway } from '@gateways/applications.gateway';
import { RecruitmentsGateway } from '@gateways/recruitments.gateway';
import { CodeGuard } from '@guards/code.guard';
import { UpdatedAtPipe } from '@pipes/updatedAt.pipe';
import { ApplicationsService } from '@services/applications.service';
import { ConfigService } from '@services/config.service';
import { EmailService } from '@services/email.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { SMSService } from '@services/sms.service';
import { copyFile, deleteFile } from '@utils/fs';
import { compareRecruitment } from '@uniqs/utils';

@Controller('applications')
@UseGuards(ThrottlerGuard)
export class ApplicationsController {
    constructor(
        private readonly applicationsGateway: ApplicationsGateway,
        private readonly recruitmentsGateway: RecruitmentsGateway,
        private readonly applicationsService: ApplicationsService,
        private readonly recruitmentsService: RecruitmentsService,
        private readonly interviewsService: InterviewsService,
        private readonly smsService: SMSService,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) {}

    @Post()
    @AcceptRole(Role.candidate)
    @UseGuards(CodeGuard)
    @UseInterceptors(FileInterceptor('resume'))
    @UsePipes(new ValidationPipe({ transform: true })) // FormData's value is always string and needs transformation
    async createApplication(
        @Candidate() candidate: CandidateEntity,
        @Body() { grade, institute, major, rank, group, intro, rid, isQuick, referrer }: CreateApplicationBody,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const recruitment = await this.recruitmentsService.findOneById(rid);
        ApplicationsController.checkRecruitment(recruitment, true);
        if (group === Group.design && !file) {
            throw new ForbiddenException(Msg.A_REQUIRE_RESUME(group));
        }
        let resume;
        if (file) {
            const { originalname, path } = file;
            resume = `${candidate.name} - ${originalname}`;
            await copyFile(path, join(this.configService.resumePaths.persistent, recruitment.name, group, resume));
        }
        const application = await this.applicationsService.createAndSave({
            grade,
            institute,
            major,
            rank,
            group,
            intro,
            isQuick,
            resume,
            referrer,
            candidate,
            recruitment,
        });
        try {
            await this.smsService.sendSMS(candidate.phone, SMS_TEMPLATE_MAP.get(SMSTemplateType.StateChange)!, [
                candidate.name,
                '成功提交报名表单',
            ]);
            await this.emailService.sendEmail(application);
        } catch ({ message }) {
            throw new InternalServerErrorException(message);
        }
        this.applicationsGateway.broadcastNew(application);
        this.recruitmentsGateway.broadcastUpdate(rid);
        return application;
    }

    @Get(':aid')
    @AcceptRole(Role.candidate | Role.member)
    async getApplication(
        @Param() { aid }: Aid,
        @Member() member?: MemberEntity,
        @Candidate() candidate?: CandidateEntity,
    ) {
        if (member) {
            return await this.applicationsService.findOneByIdForMember(aid);
        }
        if (candidate) {
            const application = await this.applicationsService.findOneByIdForCandidate(aid);
            ApplicationsController.checkCandidate(application, candidate, 'view');
            return application;
        }
        throw new InternalServerErrorException(Msg.$_OOPS('this should not happen'));
    }

    @Put(':aid')
    @AcceptRole(Role.candidate)
    @UseInterceptors(FileInterceptor('resume'))
    @UsePipes(new ValidationPipe({ transform: true })) // FormData's value is always string and needs transformation
    async setApplication(
        @Candidate() candidate: CandidateEntity,
        @Param() { aid }: Aid,
        @Body() { grade, institute, major, rank, group, intro, referrer }: SetApplicationBody,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const application = await this.applicationsService.findOneByIdForMember(aid);
        const { resume, recruitment } = application;

        ApplicationsController.checkCandidate(application, candidate, 'modify');
        ApplicationsController.checkApplicationStatus(application);
        ApplicationsController.checkRecruitment(recruitment, true);

        const persistentPath = this.configService.resumePaths.persistent;
        if (file) {
            if (resume) {
                await deleteFile(join(persistentPath, recruitment.name, application.group, resume));
            }
            const { originalname, path } = file;
            const newResume = `${candidate.name} - ${originalname}`;
            await copyFile(path, join(persistentPath, recruitment.name, group, newResume));
            application.resume = newResume;
        } else if (group !== application.group && resume) {
            const oldPath = join(persistentPath, recruitment.name, application.group, resume);
            await copyFile(oldPath, join(persistentPath, recruitment.name, group, resume));
            await deleteFile(oldPath);
        }
        if (group === Group.design && !application.resume) {
            throw new ForbiddenException(Msg.A_REQUIRE_RESUME(group));
        }

        Object.assign(application, { grade, group, institute, intro, major, rank, referrer });
        await application.save();
        this.applicationsGateway.broadcastUpdate(application);
        this.recruitmentsGateway.broadcastUpdate(recruitment.id);
    }

    @Put(':aid/abandoned')
    @AcceptRole(Role.candidate)
    async abandonApplication(@Candidate() candidate: CandidateEntity, @Param() { aid }: Aid) {
        const application = await this.applicationsService.findOneByIdForMember(aid);
        ApplicationsController.checkCandidate(application, candidate, 'abandon');
        ApplicationsController.checkApplicationStatus(application);
        ApplicationsController.checkRecruitment(application.recruitment);
        application.abandoned = true;
        await application.save();
        this.applicationsGateway.broadcastUpdate(application);
    }

    @Get(':aid/slots/:type')
    @AcceptRole(Role.candidate)
    async getInterviewSlots(@Candidate() candidate: CandidateEntity, @Param() { aid, type }: InterviewParams) {
        const application = await this.applicationsService.findOneByIdForInterview(aid);
        ApplicationsController.checkCandidate(application, candidate, 'get interview time of');
        ApplicationsController.checkStep(application, type, 'allocate time for');
        const { group, recruitment } = application;
        const name = type === InterviewType.group ? GroupOrTeam[group] : GroupOrTeam.unique;
        return recruitment.interviews.filter((interview) => interview.name === name);
    }

    @Put(':aid/slots/:type')
    @AcceptRole(Role.candidate)
    async selectInterviewSlots(
        @Candidate() candidate: CandidateEntity,
        @Param() { aid, type }: InterviewParams,
        @Body() { iids }: SelectInterviewSlotsBody,
    ) {
        const application = await this.applicationsService.findOneByIdForMember(aid);
        const { group, recruitment, interviewSelections } = application;
        ApplicationsController.checkCandidate(application, candidate, 'set interview time for');
        ApplicationsController.checkApplicationStatus(application);
        ApplicationsController.checkRecruitment(recruitment);
        ApplicationsController.checkStep(application, type, 'set interview time for');
        const name = type === InterviewType.group ? GroupOrTeam[group] : GroupOrTeam.unique;
        if (interviewSelections.find((interview) => name === interview.name)) {
            throw new ForbiddenException(Msg.A_NO_PERMISSION('re-select interview time for'));
        }
        const newSelections = await this.interviewsService.findManyByIdsInRecruitment(iids, recruitment, name);
        application.interviewSelections = [...interviewSelections, ...newSelections];
        await application.save();
        this.applicationsGateway.broadcastUpdate(application);
    }

    @Get(':aid/resume')
    @AcceptRole(Role.member | Role.candidate)
    async getResume(
        @Param() { aid }: Aid,
        @Res() res: Response,
        @Member() member?: MemberEntity,
        @Candidate() candidate?: CandidateEntity,
    ) {
        const application = await this.applicationsService.findOneByIdForMember(aid);
        if (!member && candidate) {
            ApplicationsController.checkCandidate(application, candidate, 'get resume of');
        }
        const { resume, recruitment, group } = application;
        if (!resume) {
            throw new BadRequestException(Msg.A_NO_RESUME);
        }
        const path = join(this.configService.resumePaths.persistent, recruitment.name, group, resume);
        // Filename is hex-encoded rather than base64-encoded. This fixes #21
        const filename = Buffer.from(resume).toString('hex');
        res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Disposition').download(path, filename);
    }

    @Get('recruitment/:rid')
    @AcceptRole(Role.member)
    async getApplications(
        @Member() member: MemberEntity,
        @Param() { rid }: Rid,
        @Query('updatedAt', UpdatedAtPipe) updatedAt: Date,
    ) {
        const recruitment = await this.recruitmentsService.findOneById(rid);

        if (compareRecruitment(member.joinTime, recruitment.name) >= 0) {
            throw new ForbiddenException(Msg.R_NO_PERMISSION('view applications of'));
        }

        // find applications WHERE c.updatedAt >= updatedAt AND r.rid = rid
        return await this.applicationsService.findManyByRecruitmentId(rid, updatedAt);
    }

    @Put(':aid/step')
    @AcceptRole(Role.member)
    async moveApplication(
        @Member() member: MemberEntity,
        @Param() { aid }: Aid,
        @Body() { from, to }: MoveApplicationBody,
    ) {
        const application = await this.applicationsService.findOneByIdForMember(aid);
        const { step, recruitment, candidate } = application;
        ApplicationsController.checkApplicationStatus(application);
        ApplicationsController.checkRecruitment(recruitment);
        ApplicationsController.checkGroup(application, member);
        if (step !== from) {
            throw new BadRequestException(Msg.A_MOVED(candidate.name));
        }
        await this.applicationsService.update(aid, { step: to });
        this.applicationsGateway.broadcastMove(aid, to);
        this.recruitmentsGateway.broadcastUpdate(recruitment.id);
    }

    @Delete(':aid')
    @AcceptRole(Role.admin)
    async removeApplication(@Member() member: MemberEntity, @Param() { aid }: Aid) {
        const application = await this.applicationsService.findOneByIdForMember(aid);
        const { resume, recruitment, group } = application;
        ApplicationsController.checkRecruitment(recruitment);
        ApplicationsController.checkGroup(application, member);
        if (resume) {
            await deleteFile(join(this.configService.resumePaths.persistent, recruitment.name, group, resume));
        }
        await application.remove();
        this.applicationsGateway.broadcastRemove(aid);
        this.recruitmentsGateway.broadcastUpdate(recruitment.id);
    }

    @Put(':aid/interview/:type')
    @AcceptRole(Role.member)
    async allocateOne(
        @Member() member: MemberEntity,
        @Body() { time }: AllocateOneBody,
        @Param() { aid, type }: InterviewParams,
    ) {
        const application = await this.applicationsService.findOneByIdForMember(aid);
        ApplicationsController.checkApplicationStatus(application);
        ApplicationsController.checkRecruitment(application.recruitment);
        ApplicationsController.checkStep(application, type, 'allocate time for');
        if (type === InterviewType.group) {
            ApplicationsController.checkGroup(application, member);
        }
        application.interviewAllocations[type] = new Date(time);
        await application.save();
    }

    @Put('interview/:type')
    @AcceptRole(Role.member)
    async allocateMany(
        @Member() member: MemberEntity,
        @Param() { type }: AllocateManyParams,
        @Body() { aids }: AllocateManyBody,
    ) {
        const applications = await this.applicationsService.findManyByIds(aids);

        for (const application of applications) {
            ApplicationsController.checkApplicationStatus(application);
            ApplicationsController.checkRecruitment(application.recruitment);
            ApplicationsController.checkStep(application, type, 'allocate time for');
            if (type === InterviewType.group) {
                ApplicationsController.checkGroup(application, member);
            }
        }

        if (type === InterviewType.group) {
            applications.sort(
                (a, b) =>
                    a.interviewSelections.filter(({ name }) => name === GroupOrTeam[a.group]).length -
                    b.interviewSelections.filter(({ name }) => name === GroupOrTeam[b.group]).length,
            );
        } else {
            applications.sort(
                (a, b) =>
                    a.interviewSelections.filter(({ name }) => name === GroupOrTeam.unique).length -
                    b.interviewSelections.filter(({ name }) => name === GroupOrTeam.unique).length,
            );
        }
        const interviewsMap = new Map<string, number[]>();
        for (const { recruitment } of applications) {
            for (const { id, period, slotNumber } of recruitment.interviews) {
                if (!interviewsMap.has(id)) {
                    interviewsMap.set(id, SLOTS[period].slice(0, slotNumber).reverse());
                }
            }
        }
        for (const application of applications) {
            const expectedName = type === InterviewType.group ? GroupOrTeam[application.group] : GroupOrTeam.unique;
            for (const { id, date, name } of application.interviewSelections) {
                if (name === expectedName) {
                    const slots = interviewsMap.get(id);
                    if (slots?.length) {
                        const slot = slots.pop()!;
                        const h = ~~slot;
                        const m = (slot - h) * 60;
                        const allocation = new Date(date);
                        allocation.setHours(h + date.getHours(), m + date.getMinutes(), 0, 0);
                        application.interviewAllocations[type] = allocation;
                        await application.save();
                        break;
                    }
                }
            }
        }
        return applications.map(({ interviewAllocations, id }) => ({
            aid: id,
            time: interviewAllocations[type],
        }));
    }

    private static checkApplicationStatus({ abandoned, rejected, candidate }: ApplicationEntity) {
        const { name } = candidate;
        if (abandoned) {
            throw new ForbiddenException(Msg.A_ABANDONED(name));
        }
        if (rejected) {
            throw new ForbiddenException(Msg.A_REJECTED(name));
        }
    }

    private static checkRecruitment({ beginning, deadline, name, end }: RecruitmentEntity, isDeadline = false) {
        if (+beginning > Date.now()) {
            throw new ForbiddenException(Msg.R_NOT_STARTED(name));
        }
        if (isDeadline) {
            if (+deadline < Date.now()) {
                throw new ForbiddenException(Msg.R_STOPPED(name));
            }
        } else {
            if (+end < Date.now()) {
                throw new ForbiddenException(Msg.R_ENDED(name));
            }
        }
    }

    private static checkGroup({ group }: ApplicationEntity, member: MemberEntity) {
        if (member.group !== group) {
            throw new ForbiddenException(Msg.A_CROSS_GROUP(group));
        }
    }

    private static checkCandidate(application: ApplicationEntity, candidate: CandidateEntity, action: string) {
        const { id } = application.candidate;
        if (candidate.id !== id) {
            throw new ForbiddenException(Msg.A_NO_PERMISSION(action));
        }
    }

    private static checkStep(application: ApplicationEntity, type: InterviewType, action: string) {
        const step = type === InterviewType.group ? Step.组面时间选择 : Step.群面时间选择;
        if (application.step !== step) {
            throw new ForbiddenException(Msg.A_WRONG_STEP(action, STEP_MAP.get(step)!));
        }
    }
}

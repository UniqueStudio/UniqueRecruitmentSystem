import { join } from 'path';

import {
    BadRequestException,
    Body,
    Controller,
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
import { Response } from 'express';

import { SLOTS, STEP_MAP } from '@constants/consts';
import { Group, GroupOrTeam, InterviewType, Role, Step } from '@constants/enums';
import { Candidate } from '@decorators/candidate.decorator';
import { AcceptRole } from '@decorators/role.decorator';
import { User } from '@decorators/user.decorator';
import {
    AllocateManyBody,
    AllocateManyParams,
    AllocateOneBody,
    AllocateOneParams,
    CreateCandidateBody,
    SelectInterviewSlotsBody,
    SetMyInfoBody,
} from '@dtos/candidate.dto';
import { CandidateEntity } from '@entities/candidate.entity';
import { UserEntity } from '@entities/user.entity';
import { CandidatesGateway } from '@gateways/candidates.gateway';
import { RecruitmentsGateway } from '@gateways/recruitments.gateway';
import { CodeGuard } from '@guards/code.guard';
import { UpdatedAtPipe } from '@pipes/updatedAt.pipe';
import { CandidatesService } from '@services/candidates.service';
import { ConfigService } from '@services/config.service';
import { EmailService } from '@services/email.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { SMSService } from '@services/sms.service';
import { copyFile, deleteFile } from '@utils/fs';

@Controller('candidates')
export class CandidatesController {
    constructor(
        private readonly candidatesGateway: CandidatesGateway,
        private readonly recruitmentsGateway: RecruitmentsGateway,
        private readonly candidatesService: CandidatesService,
        private readonly recruitmentsService: RecruitmentsService,
        private readonly interviewsService: InterviewsService,
        private readonly smsService: SMSService,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) {
    }

    @Post()
    @UseGuards(CodeGuard)
    @UseInterceptors(FileInterceptor('resume'))
    @UsePipes(new ValidationPipe({ transform: true })) // FormData's value is always string and needs transformation
    async createCandidate(
        @Body() {
            name, grade, institute, major, rank, mail, phone, group, gender, intro, rid, isQuick, referrer,
        }: CreateCandidateBody,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const recruitment = (await this.recruitmentsService.findPending()).find(({ id }) => id === rid);
        if (!recruitment) {
            throw new BadRequestException(`No pending recruitment with id ${rid}`);
        }
        if (+recruitment.deadline < Date.now()) {
            throw new ForbiddenException('The application deadline of this recruitment has already passed');
        }
        const candidates = await this.candidatesService.findInPendingRecruitments(phone);
        if (candidates.length) {
            throw new BadRequestException(`Candidate with phone ${phone} exists in pending recruitment(s)`);
        }
        if (group === Group.design && !file) {
            throw new ForbiddenException(`Candidate without submitting resume cannot apply to group ${group}`);
        }
        let resume;
        if (file) {
            const { originalname, path } = file;
            resume = `${name} - ${originalname}`;
            await copyFile(path, join(this.configService.resumePaths.persistent, recruitment.name, group), resume);
        }
        const candidate = await this.candidatesService.createAndSave({
            name,
            gender,
            grade,
            institute,
            major,
            rank,
            mail,
            phone,
            group,
            intro,
            isQuick,
            recruitment,
            resume,
            referrer,
        });
        try {
            await this.smsService.sendSMS(phone, 670908, [name, '成功提交报名表单']);
            await this.emailService.sendEmail(candidate);
        } catch ({ message }) {
            throw new InternalServerErrorException(message);
        }
        this.candidatesGateway.broadcastNew(candidate);
        this.recruitmentsGateway.broadcastUpdate();
    }

    @Get('me')
    @AcceptRole(Role.candidate)
    getMyInfo(
        @Candidate() candidate: CandidateEntity,
    ) {
        const bannedKeys = new Set([
            'recruitment',
            'comments',
            'interviewSelections',
            'interviewAllocations',
            'resume',
        ]);
        return Object.fromEntries(Object.entries(candidate).filter(([key]) => !bannedKeys.has(key)));
    }

    @Put('me')
    @AcceptRole(Role.candidate)
    @UseInterceptors(FileInterceptor('resume'))
    @UsePipes(new ValidationPipe({ transform: true })) // FormData's value is always string and needs transformation
    async setMyInfo(
        @Candidate() candidate: CandidateEntity,
        @Body() { name, gender, grade, group, institute, intro, isQuick, mail, major, rank, referrer }: SetMyInfoBody,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const { recruitment } = candidate;
        let { resume } = candidate;
        if (+recruitment.deadline < Date.now()) {
            throw new ForbiddenException('The application deadline of this recruitment has already passed');
        }
        if (group === Group.design && !file) {
            throw new ForbiddenException(`Candidate without submitting resume cannot apply to group ${group}`);
        }
        if (file) {
            const persistentPath = this.configService.resumePaths.persistent;
            resume && await deleteFile(join(persistentPath, recruitment.name, candidate.group), resume);
            const { originalname, path } = file;
            resume = `${name} - ${originalname}`;
            await copyFile(path, join(persistentPath, recruitment.name, group), resume);
        }
        Object.assign(
            candidate,
            { name, gender, grade, group, institute, intro, isQuick, mail, major, rank, referrer, resume },
        );
        await candidate.save();
        this.candidatesGateway.broadcastUpdate(candidate);
        this.recruitmentsGateway.broadcastUpdate();
    }

    @Get('me/slots')
    @AcceptRole(Role.candidate)
    getInterviewSlots(
        @Candidate() candidate: CandidateEntity,
    ) {
        const { recruitment, step, group } = candidate;
        if (+recruitment.end < Date.now()) {
            throw new ForbiddenException('This recruitment has already ended');
        }
        switch (step) {
            case Step.组面时间选择:
                return recruitment.interviews.filter(({ name }) => name === GroupOrTeam[group]);
            case Step.群面时间选择:
                return recruitment.interviews.filter(({ name }) => name === GroupOrTeam.unique);
            default:
                throw new ForbiddenException('No need to select time in current step');
        }
    }

    @Put('me/slots')
    @AcceptRole(Role.candidate)
    async selectInterviewSlots(
        @Candidate() candidate: CandidateEntity,
        @Body() { iids, abandon }: SelectInterviewSlotsBody,
    ) {
        const { recruitment, step, interviewSelections, group } = candidate;
        if (+recruitment.end < Date.now()) {
            throw new ForbiddenException('This recruitment has already ended');
        }
        if (abandon) {
            candidate.abandoned = true;
            await candidate.save();
            return;
        }
        switch (step) {
            case Step.组面时间选择: {
                if (interviewSelections.find(({ name }) => name === GroupOrTeam[group])) {
                    throw new ForbiddenException('You have already selected available time for the group interview');
                }
                candidate.interviewSelections = [
                    ...interviewSelections,
                    ...await this.interviewsService.findManyByIdsInRecruitment(iids, recruitment, GroupOrTeam[group]),
                ];
                await candidate.save();
                return;
            }
            case Step.群面时间选择: {
                if (interviewSelections.find(({ name }) => name === GroupOrTeam.unique)) {
                    throw new ForbiddenException('You have already selected available time for the team interview');
                }
                candidate.interviewSelections = [
                    ...interviewSelections,
                    ...await this.interviewsService.findManyByIdsInRecruitment(iids, recruitment, GroupOrTeam.unique),
                ];
                await candidate.save();
                return;
            }
            default:
                throw new ForbiddenException('No need to select time in current step');
        }
    }

    @Get(':cid/resume')
    @AcceptRole(Role.user)
    async getResume(
        @Param('cid') cid: string,
        @Res() res: Response,
    ) {
        const candidate = await this.candidatesService.findOneById(cid);
        if (!candidate) {
            throw new BadRequestException(`Candidate with id ${cid} doesn't exist`);
        }
        const { recruitment: { name }, resume, group } = candidate;
        if (!resume) {
            throw new BadRequestException(`Resume of candidate with id ${cid} doesn't exist`);
        }
        const path = join(this.configService.resumePaths.persistent, name, group, resume);
        // Filename is hex-encoded rather than base64-encoded. This fixes #21
        const filename = Buffer.from(resume).toString('hex');
        res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Disposition').download(path, filename);
    }

    @Get('recruitment/:rid')
    @AcceptRole(Role.user)
    async getCandidates(
        @User() user: UserEntity,
        @Param('rid') rid: string,
        @Query('updatedAt', UpdatedAtPipe) updatedAt: Date,
    ) {
        const recruitment = await this.recruitmentsService.findOneById(rid);

        if (!recruitment) {
            throw new BadRequestException(`Recruitment with id ${rid} doesn't exist`);
        }

        if (recruitment.createdAt < user.createdAt) {
            throw new ForbiddenException('You don\'t have permission to view this recruitment');
        }

        // find candidates WHERE c.updatedAt >= updatedAt AND r.rid = rid
        return await this.candidatesService.findManyByRecruitmentId(rid, { updatedAt });
    }

    @Put(':cid/interview/:type')
    @AcceptRole(Role.user)
    async allocateOne(
        @Body() { time }: AllocateOneBody,
        @Param() { cid, type }: AllocateOneParams,
        @User() user: UserEntity,
    ) {
        const candidate = await this.candidatesService.findOneById(cid);
        if (!candidate) {
            throw new BadRequestException(`Candidate with id ${cid} doesn't exist`);
        }
        CandidatesController.checkAllocationPermission(candidate, user, type);
        candidate.interviewAllocations[type] = new Date(time);
        await candidate.save();
    }

    @Put('interview/:type')
    @AcceptRole(Role.user)
    async allocateMany(
        @Param() { type }: AllocateManyParams,
        @Body() { cids }: AllocateManyBody,
        @User() user: UserEntity,
    ) {
        const candidates = await this.candidatesService.findManyByIds(cids);
        if (type === InterviewType.group) {
            candidates.sort((a, b) =>
                a.interviewSelections.filter(({ name }) => name === GroupOrTeam[a.group]).length
                - b.interviewSelections.filter(({ name }) => name === GroupOrTeam[b.group]).length,
            );
        } else {
            candidates.sort((a, b) =>
                a.interviewSelections.filter(({ name }) => name === GroupOrTeam.unique).length
                - b.interviewSelections.filter(({ name }) => name === GroupOrTeam.unique).length,
            );
        }
        const interviewsMap = new Map<string, number[]>();
        for (const { recruitment: { interviews } } of candidates) {
            for (const { id, period, slotNumber } of interviews) {
                !interviewsMap.has(id) && interviewsMap.set(id, SLOTS[period].slice(0, slotNumber).reverse());
            }
        }
        for (const candidate of candidates) {
            CandidatesController.checkAllocationPermission(candidate, user, type);
        }
        for (const candidate of candidates) {
            for (const { id, date, name } of candidate.interviewSelections) {
                if (
                    (type === InterviewType.group && name === GroupOrTeam[candidate.group])
                    || (type === InterviewType.team && name === GroupOrTeam.unique)
                ) {
                    const slots = interviewsMap.get(id);
                    if (slots?.length) {
                        const slot = slots.pop()!;
                        const h = ~~slot;
                        const m = (slot % 1) * 60;
                        const allocation = new Date(date);
                        allocation.setHours(h, m, 0, 0);
                        candidate.interviewAllocations[type] = allocation;
                        await candidate.save();
                        break;
                    }
                }
            }
        }
        return candidates.map(({ interviewAllocations, id }) => ({
            id,
            time: interviewAllocations[type],
        }));
    }

    private static checkAllocationPermission(candidate: CandidateEntity, user: UserEntity, type: InterviewType) {
        const { recruitment: { name, end }, group, rejected, abandoned, step, id } = candidate;
        if (rejected) {
            throw new BadRequestException(`Candidate with id ${id} has already been rejected`);
        }
        if (abandoned) {
            throw new BadRequestException(`Candidate with id ${id} has already abandoned`);
        }
        if (
            (type === InterviewType.group && step !== Step.组面时间选择)
            || (type === InterviewType.team && step !== Step.群面时间选择)
        ) {
            throw new BadRequestException(`You cannot allocate time for candidates in step ${STEP_MAP[step]}`);
        }
        if (type === InterviewType.group && user.group !== group) {
            throw new ForbiddenException(`You cannot allocate time for candidates in group ${group}`);
        }
        if (+end < Date.now()) {
            throw new BadRequestException(`Recruitment ${name} has already ended`);
        }
    }
}

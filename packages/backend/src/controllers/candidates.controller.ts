import { basename, join, resolve } from 'path';

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
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
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
    SetCandidateBody,
} from '@dtos/candidate.dto';
import { CandidateEntity } from '@entities/candidate.entity';
import { UserEntity } from '@entities/user.entity';
import { CandidatesGateway } from '@gateways/candidates.gateway';
import { RecruitmentsGateway } from '@gateways/recruitments.gateway';
import { CodeGuard } from '@guards/code.guard';
import { CandidatesService } from '@services/candidates.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { SMSService } from '@services/sms.service';
import { compareJoinTime } from '@utils/compareJoinTime';
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
    ) {
    }

    @Post()
    @UseGuards(CodeGuard)
    @UseInterceptors(FileInterceptor('resume'))
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
            resume = await copyFile(path, join('./data/resumes', recruitment.name, group), `${name} - ${originalname}`);
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
            // TODO: send email
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
        return candidate;
    }

    @Put('me')
    @AcceptRole(Role.candidate)
    @UseInterceptors(FileInterceptor('resume'))
    async setMyInfo(
        @Candidate() candidate: CandidateEntity,
        @Body() { name, gender, grade, institute, intro, isQuick, mail, major, rank, referrer }: SetCandidateBody,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const { recruitment, group } = candidate;
        let { resume } = candidate;
        if (+recruitment.deadline < Date.now()) {
            throw new ForbiddenException('The application deadline of this recruitment has already passed');
        }
        if (group === Group.design && !file) {
            throw new ForbiddenException(`Candidate without submitting resume cannot apply to group ${group}`);
        }
        if (file) {
            resume && await deleteFile(resume);
            const { originalname, path } = file;
            resume = await copyFile(path, join('./data/resumes', recruitment.name, group), `${name} - ${originalname}`);
        }
        Object.assign(
            candidate,
            { name, gender, grade, institute, intro, isQuick, mail, major, rank, referrer, resume },
        );
        // TODO: broadcast updateCandidate
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
                return recruitment.interviews.find(({ name }) => name === GroupOrTeam[group]);
            case Step.群面时间选择:
                return recruitment.interviews.find(({ name }) => name === GroupOrTeam.unique);
            default:
                throw new ForbiddenException('No need to select time in current step');
        }
    }

    @Post('me/slots')
    @AcceptRole(Role.candidate)
    async selectInterviewSlots(
        @Candidate() candidate: CandidateEntity,
        @Body() { interviewIds, abandon }: SelectInterviewSlotsBody,
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
                const newSelections = await this.interviewsService.findManyByIds(interviewIds, GroupOrTeam[group]);
                candidate.interviewSelections = [...interviewSelections, ...newSelections];
                await candidate.save();
                return;
            }
            case Step.群面时间选择: {
                if (interviewSelections.find(({ name }) => name === GroupOrTeam.unique)) {
                    throw new ForbiddenException('You have already selected available time for the team interview');
                }
                const newSelections = await this.interviewsService.findManyByIds(interviewIds, GroupOrTeam.unique);
                candidate.interviewSelections = [...interviewSelections, ...newSelections];
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
        if (!candidate?.resume) {
            throw new BadRequestException(`Resume of candidate with id ${cid} doesn't exist`);
        } else {
            const path = resolve(candidate.resume);
            // Filename is hex-encoded rather than base64-encoded. This fixes #21
            const filename = Buffer.from(basename(path)).toString('hex');
            res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Disposition').download(path, filename);
        }
    }

    @Get('recruitment/:rid')
    @AcceptRole(Role.user)
    async getCandidates(
        @User() user: UserEntity,
        @Param('rid') rid: string,
    ) {
        const { joinTime } = user;
        const recruitment = await this.recruitmentsService.findOneWithCandidates(rid);
        if (!recruitment) {
            throw new BadRequestException(`Recruitment with id ${rid} doesn't exist`);
        }
        if (compareJoinTime(joinTime, recruitment.name) >= 0) {
            throw new ForbiddenException('You don\'t have permission to view this recruitment');
        }
        return recruitment.candidates;
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
        this.checkAllocationPermission(candidate, user, type);
        candidate.interviewAllocations[type] = new Date(time);
        await candidate.save();
    }

    @Put('interview/:type/:rid')
    @AcceptRole(Role.user)
    async allocateAll(
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
        const interviewsMap = Object.fromEntries(candidates
            .flatMap(({ recruitment }) => recruitment.interviews)
            .map(({ id, period, slotNumber }) => [id, SLOTS[period].slice(0, slotNumber).reverse()]),
        );
        for (const candidate of candidates) {
            this.checkAllocationPermission(candidate, user, type);
        }
        for (const candidate of candidates) {
            for (const { id, date, name } of candidate.interviewSelections) {
                if (
                    (type === InterviewType.group && name === GroupOrTeam[candidate.group])
                    || (type === InterviewType.team && name === GroupOrTeam.unique)
                ) {
                    const slots = interviewsMap[id];
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
        return candidates.map(({ interviewAllocations }) => interviewAllocations[type]);
    }

    private checkAllocationPermission(candidate: CandidateEntity, user: UserEntity, type: InterviewType) {
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

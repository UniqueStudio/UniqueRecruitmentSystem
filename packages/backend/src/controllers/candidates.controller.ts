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

import { Group, GroupOrTeam, Role, Step } from '@constants/enums';
import { Candidate } from '@decorators/candidate.decorator';
import { AcceptRole } from '@decorators/role.decorator';
import { User } from '@decorators/user.decorator';
import { AllocateOneBody, AllocateOneParams, CreateCandidateBody, SetCandidateBody } from '@dtos/candidate.dto';
import { CandidateEntity } from '@entities/candidate.entity';
import { UserEntity } from '@entities/user.entity';
import { CandidatesGateway } from '@gateways/candidates.gateway';
import { RecruitmentsGateway } from '@gateways/recruitments.gateway';
import { CodeGuard } from '@guards/code.guard';
import { CandidatesService } from '@services/candidates.service';
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
        if (+recruitment.stop < Date.now()) {
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
        if (+recruitment.stop < Date.now()) {
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

    @Get('me/time')
    @AcceptRole(Role.candidate)
    getMyTimeSelection(
        @Candidate() candidate: CandidateEntity,
    ) {
        const { recruitment, step, group } = candidate;
        if (+recruitment.end < Date.now()) {
            throw new ForbiddenException('This recruitment has already ended');
        }
        switch (step) {
            case Step.组面:
                return recruitment.interviews.find(({ name }) => name === GroupOrTeam[group]);
            case Step.群面:
                return recruitment.interviews.find(({ name }) => name === GroupOrTeam.unique);
            default:
                throw new ForbiddenException('No need to select time in current step');
        }
    }

    @Post('me/time')
    @AcceptRole(Role.candidate)
    createMyTimeSelection(
        // @Candidate() candidate: CandidateEntity,
    ) {
        // TODO
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
    ) {
        const candidate = await this.candidatesService.findOneById(cid);
        if (!candidate) {
            throw new BadRequestException(`Candidate with id ${cid} doesn't exist`);
        }
        const { recruitment: { name, end } } = candidate;
        if (+end < Date.now()) {
            throw new BadRequestException(`Recruitment ${name} has already ended`);
        }
        candidate.interviews[type].allocation = new Date(time);
        await candidate.save();
    }

    @Put('interview/:type')
    @AcceptRole(Role.user)
    allocateAll() {
        // TODO
    }
}

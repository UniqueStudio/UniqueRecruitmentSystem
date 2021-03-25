import { basename, join, resolve } from 'path';

import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Res,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { Role } from '@constants/enums';
import { AcceptRole } from '@decorators/role.decorator';
import { User } from '@decorators/user.decorator';
import { AllocateOneBody, AllocateOneParams, CreateCandidateBody } from '@dtos/candidate.dto';
import { UserEntity } from '@entities/user.entity';
import { CandidatesGateway } from '@gateways/candidates.gateway';
import { RecruitmentsGateway } from '@gateways/recruitments.gateway';
import { CodeGuard } from '@guards/code.guard';
import { CandidatesService } from '@services/candidates.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { compareJoinTime } from '@utils/compareJoinTime';
import { copyFile } from '@utils/fs';

@Controller('candidates')
export class CandidatesController {
    constructor(
        private readonly candidatesGateway: CandidatesGateway,
        private readonly recruitmentsGateway: RecruitmentsGateway,
        private readonly candidatesService: CandidatesService,
        private readonly recruitmentsService: RecruitmentsService,
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
        // TODO
        this.candidatesGateway.broadcastNew(candidate);
        this.recruitmentsGateway.broadcastUpdate();
    }

    @Get('form/:hash')
    getForm() {
        // TODO
    }

    @Put(':cid/form/:formId')
    setCandidate() {
        // TODO
    }

    @Put(':cid/interview/:type')
    @AcceptRole(Role.user)
    async allocateOne(
        @Body() { time }: AllocateOneBody,
        @Param() { cid, type }: AllocateOneParams,
    ) {
        const candidate = await this.candidatesService.findOneById(cid);
        if (!candidate) {
            throw new BadRequestException(`Candidate of id ${cid} doesn't exist`);
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

    @Get('recruitment/:rid')
    @AcceptRole(Role.user)
    async getCandidates(
        @User() user: UserEntity,
        @Param('rid') rid: string,
    ) {
        const { joinTime } = user;
        const recruitment = await this.recruitmentsService.findOneWithCandidates(rid);
        if (!recruitment) {
            throw new BadRequestException(`Recruitment of id ${rid} doesn't exist`);
        }
        if (compareJoinTime(joinTime, recruitment.name) >= 0) {
            throw new UnauthorizedException('You don\'t have permission to view this recruitment');
        }
        return recruitment.candidates;
    }

    @Get(':cid/resume')
    @AcceptRole(Role.user)
    async getResume(
        @Param('cid') cid: string,
        @Res() res: Response,
    ) {
        const candidate = await this.candidatesService.findOneById(cid);
        if (!candidate?.resume) {
            throw new BadRequestException(`Resume of candidate id ${cid} doesn't exist`);
        } else {
            const path = resolve(candidate.resume);
            // Filename is hex-encoded rather than base64-encoded. This fixes #21
            const filename = Buffer.from(basename(path)).toString('hex');
            res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Disposition').download(path, filename);
        }
    }
}

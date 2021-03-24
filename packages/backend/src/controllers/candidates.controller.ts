import { join } from 'path';

import { BadRequestException, Body, Controller, Get, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Role } from '@constants/enums';
import { AcceptRole } from '@decorators/role.decorator';
import { CreateCandidateDto } from '@dtos/candidate.dto';
import { CandidatesGateway } from '@gateways/candidates.gateway';
import { RecruitmentsGateway } from '@gateways/recruitments.gateway';
import { CandidatesService } from '@services/candidates.service';
import { RecruitmentsService } from '@services/recruitments.service';
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
    @UseInterceptors(FileInterceptor('resume'))
    async createCandidate(
        @Body() {
            name, grade, institute, major, rank, mail, phone, group, gender, intro, rid, isQuick, referrer,
        }: CreateCandidateDto,
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
    allocateOne() {
        // TODO
    }

    @Put('interview/:type')
    @AcceptRole(Role.user)
    allocateAll() {
        // TODO
    }

    @Get(':query')
    @AcceptRole(Role.user)
    getCandidates() {
        // TODO
    }

    @Get(':cid/resume')
    @AcceptRole(Role.user)
    getResume() {
        // TODO
    }
}

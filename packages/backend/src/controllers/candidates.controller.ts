import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { Role } from '@constants/enums';
import { Candidate } from '@decorators/candidate.decorator';
import { AcceptRole } from '@decorators/role.decorator';
import { CreateCandidateBody, SetCandidateBody } from '@dtos/candidate.dto';
import { CandidateEntity } from '@entities/candidate.entity';
import { CodeGuard } from '@guards/code.guard';
import { CandidatesService } from '@services/candidates.service';

@Controller('candidates')
@UseGuards(ThrottlerGuard)
export class CandidatesController {
    constructor(
        private readonly candidatesService: CandidatesService,
    ) {}

    @Post()
    @UseGuards(CodeGuard)
    async createCandidate(@Body() { name, gender, phone, password, mail }: CreateCandidateBody) {
        await this.candidatesService.hashPasswordAndCreate(
            { name, gender, phone, mail },
            password,
        );
    }

    @Get('me')
    @AcceptRole(Role.candidate)
    getMyInfo(@Candidate() candidate: CandidateEntity) {
        return candidate;
    }

    @Put('me')
    @AcceptRole(Role.candidate)
    async setMyInfo(
        @Candidate() candidate: CandidateEntity,
        @Body(){ phone, mail, password }: SetCandidateBody,
    ) {
        if (password) {
            candidate.password = await this.candidatesService.hashPassword(password);
        }
        candidate.phone = phone;
        candidate.mail = mail;
        await candidate.save();
    }
}

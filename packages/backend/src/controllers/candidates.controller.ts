import { Controller, Get, Post, Put, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@guards/jwtAuth.guard';

@Controller('candidates')
export class CandidatesController {
    @Post()
    addCandidate() {
        // TODO
    }

    @Get(':cid/form/:formId')
    getForm() {
        // TODO
    }

    @Get('form/:hash')
    newGetForm() {
        // TODO
    }

    @Put(':cid/form/:formId')
    setCandidate() {
        // TODO
    }

    @Put(':cid/form/:formId')
    newSetCandidate() {
        // TODO
    }

    @Put(':cid/interview/:type')
    @UseGuards(JwtAuthGuard)
    allocateOne() {
        // TODO
    }

    @Put('interview/:type')
    @UseGuards(JwtAuthGuard)
    allocateAll() {
        // TODO
    }

    @Get(':query')
    @UseGuards(JwtAuthGuard)
    getCandidates() {
        // TODO
    }

    @Get(':cid/resume')
    @UseGuards(JwtAuthGuard)
    getResume() {
        // TODO
    }
}

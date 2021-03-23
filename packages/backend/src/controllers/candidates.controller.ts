import { Controller, Get, Post, Put } from '@nestjs/common';

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
    allocateOne() {
        // TODO
    }

    @Put('interview/:type')
    allocateAll() {
        // TODO
    }

    @Get(':query')
    getCandidates() {
        // TODO
    }

    @Get(':cid/resume')
    getResume() {
        // TODO
    }
}

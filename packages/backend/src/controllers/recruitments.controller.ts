import { Controller, Get, Post, Put } from '@nestjs/common';

@Controller('recruitments')
export class RecruitmentsController {
    @Get('pending')
    getPendingTitles() {
        // TODO
    }

    @Post()
    launchRecruitment() {
        // TODO
    }

    @Get()
    getAllRecruitments() {
        // TODO
    }

    @Get('title/:title')
    getOneRecruitment() {
        // TODO
    }

    @Put('title/:title')
    setRecruitment() {
        // TODO
    }
}

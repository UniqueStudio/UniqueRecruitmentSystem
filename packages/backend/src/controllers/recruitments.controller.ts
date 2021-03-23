import { Controller, Get, Post, Put, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@guards/jwtAuth.guard';

@Controller('recruitments')
export class RecruitmentsController {
    @Get('pending')
    getPendingRecruitments() {
        // TODO
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    launchRecruitment() {
        // TODO
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getAllRecruitments() {
        // TODO
    }

    @Get('title/:title')
    @UseGuards(JwtAuthGuard)
    getOneRecruitment() {
        // TODO
    }

    @Put('title/:title')
    @UseGuards(JwtAuthGuard)
    setRecruitment() {
        // TODO
    }
}

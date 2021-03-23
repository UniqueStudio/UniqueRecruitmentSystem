import { Controller, Get, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@guards/jwtAuth.guard';

@Controller('sms')
export class SMSController {
    @Get('verification/candidate/:phone')
    sendCodeToCandidate() {
        // TODO
    }

    @Get('verification/user')
    @UseGuards(JwtAuthGuard)
    sendCodeToUser() {
        // TODO
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    sendSMSToCandidate() {
        // TODO
    }
}

import { Controller, Get, Post } from '@nestjs/common';

@Controller('sms')
export class SMSController {
    @Get('verification/candidate/:phone')
    sendCodeToCandidate() {
        // TODO
    }

    @Get('verification/user')
    sendCodeToUser() {
        // TODO
    }

    @Post()
    sendSMSToCandidate() {
        // TODO
    }
}

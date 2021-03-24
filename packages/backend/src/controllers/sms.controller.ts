import { Controller, Get, Post } from '@nestjs/common';

import { Role } from '@constants/enums';
import { AcceptRole } from '@decorators/role.decorator';

@Controller('sms')
export class SMSController {
    @Get('verification/candidate/:phone')
    sendCodeToCandidate() {
        // TODO
    }

    @Get('verification/user')
    @AcceptRole(Role.user)
    sendCodeToUser() {
        // TODO
    }

    @Post()
    @AcceptRole(Role.user)
    sendSMSToCandidate() {
        // TODO
    }
}

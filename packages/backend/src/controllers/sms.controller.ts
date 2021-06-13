import { randomBytes } from 'crypto';

import {
    BadRequestException,
    Body,
    CACHE_MANAGER,
    Controller,
    Get,
    Inject,
    InternalServerErrorException,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Cache } from 'cache-manager';

import { GroupOrTeam, Role, SMSType, Step } from '@constants/enums';
import { Msg } from '@constants/messages';
import { Candidate } from '@decorators/candidate.decorator';
import { Member } from '@decorators/member.decorator';
import { AcceptRole } from '@decorators/role.decorator';
import { SendCodeToOthersParams, SendSMSToCandidateBody } from '@dtos/sms.dto';
import { CandidateEntity } from '@entities/candidate.entity';
import { MemberEntity } from '@entities/member.entity';
import { CodeGuard } from '@guards/code.guard';
import { ApplicationsService } from '@services/applications.service';
import { SMSService } from '@services/sms.service';
import { applySMSTemplate } from '@utils/applySMSTemplate';
import { cacheKey } from '@utils/cacheKey';

@Controller('sms')
@UseGuards(ThrottlerGuard)
export class SMSController {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly applicationsService: ApplicationsService,
        private readonly smsService: SMSService,
    ) {}

    private async sendCode(phone: string, role?: Role.candidate | Role.member) {
        const code = randomBytes(2).toString('hex');
        try {
            // 您{1}的验证码为：{2}，请于3分钟内填写。如非本人操作，请忽略本短信。
            await this.smsService.sendSMS(phone, '719160', ['dashboard中', code]);
        } catch ({ message }) {
            throw new InternalServerErrorException(message);
        }
        await this.cacheManager.set(cacheKey(phone, role), code, { ttl: 180 });
    }

    @Get('verification/other/:phone')
    @Throttle(1, 60)
    sendCodeToOthers(@Param() { phone }: SendCodeToOthersParams) {
        return this.sendCode(phone);
    }

    @Get('verification/candidate')
    @Throttle(1, 60)
    @AcceptRole(Role.candidate)
    async sendCodeToCandidate(@Candidate() { phone }: CandidateEntity) {
        return this.sendCode(phone, Role.candidate);
    }

    @Get('verification/member')
    @Throttle(1, 60)
    @AcceptRole(Role.member)
    async sendCodeToMember(@Member() { phone }: MemberEntity) {
        return this.sendCode(phone, Role.member);
    }

    @Post()
    @AcceptRole(Role.admin)
    @UseGuards(CodeGuard)
    async sendSMSToCandidate(
        @Body() { type, time, place, rest, next, aids }: SendSMSToCandidateBody,
        @Member() member: MemberEntity,
    ) {
        const applications = await this.applicationsService.findManyByIds(aids);
        const errors = new Set<string>();
        for (const application of applications) {
            const { group, rejected, abandoned, recruitment, candidate } = application;
            const interviews = recruitment.interviews;
            if (+recruitment.end < Date.now()) {
                errors.add(Msg.R_ENDED(recruitment.name));
                continue;
            }
            if (member.group !== group) {
                errors.add(Msg.A_CROSS_GROUP(group));
                continue;
            }
            if (rejected) {
                errors.add(Msg.A_REJECTED(candidate.name));
                continue;
            }
            if (abandoned) {
                errors.add(Msg.A_ABANDONED(candidate.name));
                continue;
            }
            if (type === SMSType.accept) {
                if (next === Step.组面时间选择 && !interviews.find(({ name }) => name === GroupOrTeam[group])) {
                    errors.add(Msg.R_NO_INTERVIEWS(`group ${group}`));
                    continue;
                }
                if (next === Step.群面时间选择 && !interviews.find(({ name }) => name === GroupOrTeam.unique)) {
                    errors.add(Msg.R_NO_INTERVIEWS('the team'));
                    continue;
                }
            } else {
                application.rejected = true;
                await application.save();
            }
            try {
                const { template, params } = applySMSTemplate({ application, type, rest, next, time, place });
                await this.smsService.sendSMS(candidate.phone, template, params);
            } catch ({ message }) {
                errors.add(message as string);
            }
        }
        if (errors.size) {
            throw new BadRequestException([...errors].join(', '));
        }
    }
}

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
import { AcceptRole } from '@decorators/role.decorator';
import { User } from '@decorators/user.decorator';
import { SendSMSToCandidateBody } from '@dtos/sms.dto';
import { UserEntity } from '@entities/user.entity';
import { CodeGuard } from '@guards/code.guard';
import { CandidatesService } from '@services/candidates.service';
import { SMSService } from '@services/sms.service';
import { applySMSTemplate } from '@utils/applySMSTemplate';
import { cacheKey } from '@utils/cacheKey';

@Controller('sms')
@UseGuards(ThrottlerGuard)
export class SMSController {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly candidatesService: CandidatesService,
        private readonly smsService: SMSService,
    ) {
    }

    @Get('verification/candidate/:phone')
    @Throttle(1, 60)
    async sendCodeToCandidate(
        @Param('phone') phone: string,
    ) {
        const code = randomBytes(2).toString('hex');
        try {
            // 您{1}的验证码为：{2}，请于3分钟内填写。如非本人操作，请忽略本短信。
            await this.smsService.sendSMS(phone, 719160, ['报名本次招新', code]);
        } catch ({ message }) {
            throw new InternalServerErrorException(message);
        }
        await this.cacheManager.set(cacheKey(phone, false), code, { ttl: 180 });
    }

    @Get('verification/user')
    @Throttle(1, 60)
    @AcceptRole(Role.user)
    async sendCodeToUser(
        @User() { phone }: UserEntity,
    ) {
        const code = randomBytes(2).toString('hex');
        try {
            // 您{1}的验证码为：{2}，请于3分钟内填写。如非本人操作，请忽略本短信。
            await this.smsService.sendSMS(phone, 719160, ['dashboard中', code]);
        } catch ({ message }) {
            throw new InternalServerErrorException(message);
        }
        await this.cacheManager.set(cacheKey(phone, true), code, { ttl: 180 });
    }

    @Post()
    @AcceptRole(Role.user)
    @UseGuards(CodeGuard)
    async sendSMSToCandidate(
        @Body() { type, time, place, rest, next, cids }: SendSMSToCandidateBody,
    ) {
        const candidates = await this.candidatesService.findManyByIds(cids);
        const errors = new Set<string>();
        for (const candidate of candidates) {
            try {
                if (type === SMSType.accept) {
                    const { recruitment: { end, name, interviews }, group } = candidate;
                    if (+end < Date.now()) {
                        throw new BadRequestException(`Recruitment ${name} has already ended`);
                    }
                    if (next === Step.组面时间选择) {
                        if (!interviews.find(({ name }) => name === GroupOrTeam[group])) {
                            throw new BadRequestException(`No interviews are scheduled for ${group} group`);
                        }
                    } else if (next === Step.群面时间选择) {
                        if (!interviews.find(({ name }) => name === GroupOrTeam.unique)) {
                            throw new BadRequestException('No interviews are scheduled for the team');
                        }
                    }
                } else {
                    candidate.rejected = true;
                    await candidate.save();
                }
                const { template, params } = applySMSTemplate({ candidate, type, rest, next, time, place });
                await this.smsService.sendSMS(candidate.phone, template, params);
            } catch ({ message }) {
                errors.add(message);
            }
        }
        if (errors.size) {
            throw new BadRequestException([...errors].join(', '));
        }
    }
}

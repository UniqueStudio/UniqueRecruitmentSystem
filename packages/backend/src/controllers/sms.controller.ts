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
    Post, UseGuards,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import got from 'got';

import { GroupOrTeam, Role, SMSType, Step } from '@constants/enums';
import { AcceptRole } from '@decorators/role.decorator';
import { User } from '@decorators/user.decorator';
import { SendSMSToCandidateBody } from '@dtos/sms.dto';
import { UserEntity } from '@entities/user.entity';
import { CodeGuard } from '@guards/code.guard';
import { CandidatesService } from '@services/candidates.service';
import { AppConfigService } from '@services/config.service';
import { applySMSTemplate } from '@utils/applySMSTemplate';

@Controller('sms')
export class SMSController {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly configService: AppConfigService,
        private readonly candidatesService: CandidatesService,
    ) {
    }

    private async sendSMS(phone: string, template: number, params: string[]) {
        const res = await got.post(this.configService.smsURL, {
            headers: {
                Token: this.configService.get('SMS_API_TOKEN'),
            },
            json: {
                phone,
                template,
                param_list: params,
            },
        }).json<{ code: number; message: string }>();
        if (res.code !== 200) {
            throw new InternalServerErrorException(res.message);
        }
    }

    @Get('verification/candidate/:phone')
    async sendCodeToCandidate(
        @Param('phone') phone: string,
    ) {
        const code = randomBytes(2).toString('hex');
        // 您{1}的验证码为：{2}，请于3分钟内填写。如非本人操作，请忽略本短信。
        await this.sendSMS(phone, 719160, ['报名本次招新', code]);
        await this.cacheManager.set(`candidateCode:${phone}`, code, 180);
    }

    @Get('verification/user')
    @AcceptRole(Role.user)
    async sendCodeToUser(
        @User() { phone }: UserEntity,
    ) {
        const code = randomBytes(2).toString('hex');
        // 您{1}的验证码为：{2}，请于3分钟内填写。如非本人操作，请忽略本短信。
        await this.sendSMS(phone, 719160, ['dashboard中', code]);
        await this.cacheManager.set(`userCode:${phone}`, code, 180);
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
            if (type === SMSType.accept) {
                //TODO: 废弃formid的设定
                // if (!recruitmentId) {
                // 仅执行一次，用于生成含有recruitment id的formId
                // 以后所有的candidates都可以复用这个formId
                const { recruitment: { end, name, interviews }, group } = candidate;
                if (+end < Date.now()) {
                    throw new BadRequestException(`Recruitment ${name} has already ended`);
                }
                if (next === Step.组面) {
                    if (!interviews.find(({ name }) => name === GroupOrTeam[group])) {
                        throw new BadRequestException(`No interviews are scheduled for ${group} group`);
                    }
                } else if (next === Step.群面) {
                    if (!interviews.find(({ name }) => name === GroupOrTeam.unique)) {
                        throw new BadRequestException('No interviews are scheduled for the team');
                    }
                }
                // recruitmentId = `${recruitment._id}`;
                // }
                // const payload = {
                //     recruitmentId,
                //     id,
                //     step: nextStep === 2 ? 'group' : 'team',
                //     group,
                // };
                // hash = md5(payload);
                // Promise.all([
                //     PayloadRepo.createAndInsert({ ...payload, hash }),
                //     redisAsync.set(`payload:${hash}`, id, 'EX', 60 * 60 * 24 * 2),
                // ]).catch((e) => {
                //     throw new Error(`Error in ${name}: ${e}`);
                // });
            }
            if (type === SMSType.reject) {
                candidate.rejected = true;
                await candidate.save();
            }
            // const url = recruitmentId ? await shortenURL(`${formURL}/${hash}`) : '';
            try {
                const { template, params } = applySMSTemplate({
                    candidate,
                    type,
                    rest,
                    next,
                    time,
                    place,
                });
                await this.sendSMS(candidate.phone, template, params);
            } catch ({ message }) {
                errors.add(message);
            }
        }
        if (errors.size) {
            throw new BadRequestException([...errors].join(', '));
        }
    }
}

import { IsEnum, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';

import { SMSType, Step } from '@constants/enums';
import { SMSTemplate } from '@uniqs/config';

export class SendCodeToOthersParams {
    @IsPhoneNumber('CN')
    phone!: string;
}

export class SendSMSToCandidateBody implements SMSTemplate {
    @IsEnum(SMSType)
    type!: SMSType;

    @IsOptional()
    @IsString()
    time?: string;

    @IsOptional()
    @IsString()
    place?: string;

    @IsOptional()
    @IsString()
    meetingId?: string;

    @IsOptional()
    @IsString()
    rest?: string;

    @IsOptional()
    @IsEnum(Step)
    current?: Step;

    @IsOptional()
    @IsEnum(Step)
    next?: Step;

    @IsUUID(4, {
        each: true,
    })
    aids!: string[];
}

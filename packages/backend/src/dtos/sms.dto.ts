import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { SMSType, Step } from '@constants/enums';

export class SendSMSToCandidateBody {
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
    rest?: string;

    @IsEnum(Step)
    next!: Step;

    @IsUUID(4, {
        each: true,
    })
    cids!: string[];
}

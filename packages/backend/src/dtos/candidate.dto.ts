import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';

import { Gender, Grade, Group, InterviewType, Rank, Step } from '@constants/enums';

export class SetMyInfoBody {
    @IsString()
    name!: string;

    @IsEnum(Gender)
    @Type(() => Number)
    gender!: Gender;

    @IsEnum(Group)
    group!: Group;

    @IsEnum(Grade)
    @Type(() => Number)
    grade!: Grade;

    @IsString()
    institute!: string;

    @IsString()
    major!: string;

    @IsEnum(Rank)
    @Type(() => Number)
    rank!: Rank;

    @IsEmail()
    mail!: string;

    @IsString()
    intro!: string;

    @IsBoolean()
    @Type(() => Boolean)
    isQuick!: boolean;

    @IsOptional()
    @IsString()
    referrer?: string;
}

export class CreateCandidateBody extends SetMyInfoBody {
    @IsPhoneNumber('CN')
    phone!: string;

    @IsUUID(4)
    rid!: string;
}

export class SelectInterviewSlotsBody {
    @IsBoolean()
    abandon!: boolean;

    @IsUUID(4, {
        each: true,
    })
    iids!: string[];
}

export class AllocateOneBody {
    @IsDateString()
    time!: string;
}

export class AllocateManyParams {
    @IsEnum(InterviewType)
    type!: InterviewType;
}

export class AllocateOneParams extends AllocateManyParams {
    @IsUUID(4)
    cid!: string;
}

export class AllocateManyBody {
    @IsUUID(4, {
        each: true,
    })
    cids!: string[];
}

export class RemoveCandidateBody {
    @IsUUID(4)
    cid!: string;

    @IsString()
    token!: string;
}

export class MoveCandidateBody extends RemoveCandidateBody {
    @IsEnum(Step)
    from!: Step;

    @IsEnum(Step)
    to!: Step;
}

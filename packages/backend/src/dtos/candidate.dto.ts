import { IsBoolean, IsDateString, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';

import { Gender, Grade, Group, InterviewType, Rank, Step } from '@constants/enums';

export class CreateCandidateBody {
    @IsString()
    name!: string;

    @IsEnum(Gender)
    gender!: Gender;

    @IsEnum(Grade)
    grade!: Grade;

    @IsString()
    institute!: string;

    @IsString()
    major!: string;

    @IsEnum(Rank)
    rank!: Rank;

    @IsEmail()
    mail!: string;

    @IsPhoneNumber('CN')
    phone!: string;

    @IsEnum(Group)
    group!: Group;

    @IsString()
    intro!: string;

    @IsBoolean()
    isQuick!: boolean;

    @IsOptional()
    @IsString()
    referrer?: string;

    @IsUUID(4)
    rid!: string;
}

export class AllocateOneBody {
    @IsDateString()
    time!: string;
}

export class AllocateOneParams {
    @IsUUID()
    cid!: string;

    @IsEnum(InterviewType)
    type!: InterviewType;
}

export class RemoveCandidateBody {
    @IsUUID()
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

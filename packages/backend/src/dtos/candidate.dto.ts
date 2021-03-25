import { IsBoolean, IsDateString, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';

import { Gender, Grade, Group, InterviewType, Rank, Step } from '@constants/enums';

export class SetCandidateBody {
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

    @IsString()
    intro!: string;

    @IsBoolean()
    isQuick!: boolean;

    @IsOptional()
    @IsString()
    referrer?: string;
}

export class CreateCandidateBody extends SetCandidateBody {
    @IsPhoneNumber('CN')
    phone!: string;

    @IsEnum(Group)
    group!: Group;

    @IsUUID(4)
    rid!: string;
}

export class AllocateOneBody {
    @IsDateString()
    time!: string;
}

export class AllocateOneParams {
    @IsUUID(4)
    cid!: string;

    @IsEnum(InterviewType)
    type!: InterviewType;
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

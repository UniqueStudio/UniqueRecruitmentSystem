import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { Grade, Group, InterviewType, Rank, Step } from '@constants/enums';

export class Rid {
    @IsUUID(4)
    rid!: string;
}

export class Aid {
    @IsUUID(4)
    aid!: string;
}

export class SetApplicationBody {
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

    @IsString()
    intro!: string;

    @IsOptional()
    @IsString()
    referrer?: string;
}

export class CreateApplicationBody extends SetApplicationBody {
    @IsBoolean()
    @Type(() => Boolean)
    isQuick!: boolean;

    @IsUUID(4)
    rid!: string;
}

export class MoveApplicationBody {
    @IsEnum(Step)
    from!: Step;

    @IsEnum(Step)
    to!: Step;
}

export class AllocateOneBody {
    @IsDateString()
    time!: string;
}

export class AllocateManyParams {
    @IsEnum(InterviewType)
    type!: InterviewType;
}

export class InterviewParams extends AllocateManyParams {
    @IsUUID(4)
    aid!: string;
}

export class AllocateManyBody {
    @IsUUID(4, { each: true })
    aids!: string[];
}

export class SelectInterviewSlotsBody {
    @IsUUID(4, { each: true })
    iids!: string[];
}

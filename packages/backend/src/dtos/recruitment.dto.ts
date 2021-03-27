import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsInt, IsString, Matches, Min, ValidateNested } from 'class-validator';

import { Period } from '@constants/enums';

export class SetRecruitmentScheduleBody {
    @IsDateString()
    beginning!: string;

    @IsDateString()
    deadline!: string;

    @IsDateString()
    end!: string;
}

class InterviewsElement {
    @IsDateString()
    date!: string;

    @IsEnum(Period)
    period!: Period;

    @IsInt()
    @Min(0)
    slotNumber!: number;
}

export class SetRecruitmentInterviewsBody {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InterviewsElement)
    interviews!: InterviewsElement[];
}

export class CreateRecruitmentBody extends SetRecruitmentScheduleBody {
    @IsString()
    @Matches(/^\d{4}[ASC]$/)
    name!: string;
}

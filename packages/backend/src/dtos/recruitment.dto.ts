import { IsDateString, IsEnum, IsInt, IsString, Matches, Min } from 'class-validator';

import { Period } from '@constants/enums';

export class SetRecruitmentScheduleDto {
    @IsDateString()
    begin!: string;

    @IsDateString()
    end!: string;

    @IsDateString()
    stop!: string;
}

export class SetRecruitmentInterviewsDto {
    @IsDateString()
    date!: string;

    @IsEnum(Period)
    period!: Period;

    @IsInt()
    @Min(0)
    slots!: number;
}

export class CreateRecruitmentDto extends SetRecruitmentScheduleDto {
    @IsString()
    @Matches(/^\d{4}[ASC]$/)
    name!: string;
}

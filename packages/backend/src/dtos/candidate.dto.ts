import { IsBoolean, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';

import { Gender, Grade, Group, Rank } from '@constants/enums';

export class CreateCandidateDto {
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

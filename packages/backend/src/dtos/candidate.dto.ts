import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

import { Gender } from '@constants/enums';

export class SetCandidateBody {
    @IsOptional()
    @IsString()
    password?: string;

    @IsPhoneNumber('CN')
    phone!: string;

    @IsEmail()
    mail!: string;
}

export class CreateCandidateBody {
    @IsString()
    password!: string;

    @IsPhoneNumber('CN')
    phone!: string;

    @IsEmail()
    mail!: string;

    @IsString()
    name!: string;

    @IsEnum(Gender)
    gender!: Gender;
}

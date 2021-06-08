import { IsEmail, IsEnum, IsPhoneNumber, IsString } from 'class-validator';

import { Gender } from '@constants/enums';

export class SetCandidateBody {
    @IsString()
    password!: string;

    @IsPhoneNumber('CN')
    phone!: string;

    @IsEmail()
    mail!: string;
}

export class CreateCandidateBody extends SetCandidateBody {
    @IsString()
    name!: string;

    @IsEnum(Gender)
    gender!: Gender;
}

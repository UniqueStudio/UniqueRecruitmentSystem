import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class SetUserInfoBody {
    @IsEmail()
    mail!: string;

    @IsPhoneNumber('CN')
    phone!: string;

    @IsOptional()
    @IsString()
    password?: string;
}

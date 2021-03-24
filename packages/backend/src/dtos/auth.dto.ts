import { IsPhoneNumber, IsString } from 'class-validator';

export class AuthUserByPasswordDto {
    @IsPhoneNumber('CN')
    phone!: string;

    @IsString()
    password!: string;
}

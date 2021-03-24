import { IsEmail } from 'class-validator';

import { AuthUserByPasswordDto } from '@dtos/auth.dto';

export class SetUserInfoDto extends AuthUserByPasswordDto {
    @IsEmail()
    mail!: string;
}

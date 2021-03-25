import { IsEmail } from 'class-validator';

import { AuthUserByPasswordBody } from '@dtos/auth.dto';

export class SetUserInfoBody extends AuthUserByPasswordBody {
    @IsEmail()
    mail!: string;
}

import { IsPhoneNumber, IsString } from 'class-validator';

export class AuthUserByPasswordBody {
    @IsPhoneNumber('CN')
    phone!: string;

    @IsString()
    password!: string;
}

export class AuthByCodeBody {
    @IsPhoneNumber('CN')
    phone!: string;

    @IsString()
    code!: string;
}

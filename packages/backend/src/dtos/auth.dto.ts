import { IsPhoneNumber, IsString } from 'class-validator';

export class AuthMemberByQRCodeParams {
    @IsString()
    key!: string;
}

export class AuthByPasswordBody {
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

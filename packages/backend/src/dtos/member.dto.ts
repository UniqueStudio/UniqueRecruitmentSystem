import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';

export class SetMemberInfoBody {
    @IsEmail()
    mail!: string;

    @IsPhoneNumber('CN')
    phone!: string;

    @IsOptional()
    @IsString()
    password?: string;
}

export class SetAdminsBody {
    @IsUUID(4, { each: true })
    mids!: string[];
}

import { IUserEntity } from '@uniqs/config';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Column } from 'typeorm';

import { Gender } from '@constants/enums';
import { CommonEntity } from '@entities/common.entity';

class Password {
    @Column({ select: false })
    @IsString()
    salt!: string;

    @Column({ select: false, unique: true }) // looking forward to a collision :)
    @IsString()
    hash!: string;
}

export abstract class UserEntity extends CommonEntity implements IUserEntity {
    @Column()
    @IsString()
    name!: string;

    @Column(() => Password)
    password!: Password;

    @Column({ unique: true })
    @IsPhoneNumber('CN')
    phone!: string;

    @Column({ unique: true, nullable: true })
    @IsOptional()
    @IsEmail()
    mail?: string;

    @Column('enum', { enum: Gender })
    @IsEnum(Gender)
    gender!: Gender;
}

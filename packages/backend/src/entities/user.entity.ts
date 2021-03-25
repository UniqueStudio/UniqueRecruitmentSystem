import { IsBoolean, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsUrl, Matches } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { Gender, Group } from '@constants/enums';
import { CommentEntity } from '@entities/comment.entity';
import { CommonEntity } from '@entities/common.entity';

class Password {
    @Column({ select: false })
    @IsString()
    salt!: string;

    @Column({ select: false, unique: true }) // looking forward to a collision :)
    @IsString()
    hash!: string;
}

@Entity('users')
export class UserEntity extends CommonEntity {
    @Column({ unique: true })
    @IsString()
    weChatID!: string;

    @Column()
    @IsString()
    name!: string;

    @Column(() => Password)
    password!: Password;

    @Column()
    @IsString()
    @Matches(/^\d{4}[ASC]$/)
    joinTime!: string;

    @Column({ default: false })
    @IsOptional()
    @IsBoolean()
    isCaptain!: boolean;

    @Column({ default: false })
    @IsOptional()
    @IsBoolean()
    isAdmin!: boolean;

    @Column({ unique: true })
    @IsPhoneNumber('CN')
    phone!: string;

    @Column({ unique: true })
    @IsEmail()
    mail!: string;

    @Column({ enum: Gender })
    @IsEnum(Gender)
    gender!: Gender;

    @Column({ enum: Group })
    @IsEnum(Group)
    group!: Group;

    @Column({ nullable: true })
    @IsOptional()
    @IsUrl({ protocols: ['https'] })
    avatar?: string;

    @OneToMany(() => CommentEntity, ({ user }) => user)
    comments!: CommentEntity[];
}

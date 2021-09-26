import { IsBoolean, IsEnum, IsOptional, IsString, IsUrl, Matches } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { Group } from '@constants/enums';
import { CommentEntity } from '@entities/comment.entity';
import { UserEntity } from '@entities/user.entity';
import { IMemberEntity } from '@uniqs/config';

@Entity('members')
export class MemberEntity extends UserEntity implements IMemberEntity {
    @Column({ unique: true })
    @IsString()
    weChatID!: string;

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

    @Column('enum', { enum: Group })
    @IsEnum(Group)
    group!: Group;

    @Column({ nullable: true })
    @IsOptional()
    @IsUrl({ protocols: ['https'] })
    avatar?: string;

    @OneToMany(() => CommentEntity, ({ member }) => member)
    comments!: CommentEntity[];
}

import { ICommentEntity } from '@uniqs/config';
import { IsEnum, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Evaluation } from '@constants/enums';
import { ApplicationEntity } from '@entities/application.entity';
import { CommonEntity } from '@entities/common.entity';
import { MemberEntity } from '@entities/member.entity';

@Entity('comments')
export class CommentEntity extends CommonEntity implements ICommentEntity {
    @ManyToOne(() => ApplicationEntity, ({ comments }) => comments, { onDelete: 'CASCADE' })
    application!: ApplicationEntity;

    @ManyToOne(() => MemberEntity, ({ comments }) => comments, { onDelete: 'CASCADE' })
    member!: MemberEntity;

    @Column()
    @IsString()
    content!: string;

    @Column('enum', { enum: Evaluation })
    @IsEnum(Evaluation)
    evaluation!: Evaluation;
}

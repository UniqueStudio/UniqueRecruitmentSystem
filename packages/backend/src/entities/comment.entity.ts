import { IsEnum, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Evaluation } from '@constants/enums';
import { CandidateEntity } from '@entities/candidate.entity';
import { CommonEntity } from '@entities/common.entity';
import { UserEntity } from '@entities/user.entity';

@Entity('comments')
export class CommentEntity extends CommonEntity {
    @ManyToOne(() => CandidateEntity, ({ comments }) => comments, { onDelete: 'CASCADE' })
    candidate!: CandidateEntity;

    @ManyToOne(() => UserEntity, ({ comments }) => comments, { onDelete: 'CASCADE' })
    user!: UserEntity;

    @Column()
    @IsString()
    content!: string;

    @Column('enum', { enum: Evaluation })
    @IsEnum(Evaluation)
    evaluation!: Evaluation;
}

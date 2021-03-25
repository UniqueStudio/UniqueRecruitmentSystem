import { IsEnum, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Evaluation } from '@constants/enums';
import { CandidateEntity } from '@entities/candidate.entity';
import { CommonEntity } from '@entities/common.entity';
import { UserEntity } from '@entities/user.entity';

@Entity('comments')
export class CommentEntity extends CommonEntity {
    @ManyToOne(() => CandidateEntity, ({ comments }) => comments)
    candidate!: CandidateEntity;

    @ManyToOne(() => UserEntity, ({ comments }) => comments)
    user!: UserEntity;

    @Column()
    @IsString()
    content!: string;

    @Column({ enum: Evaluation })
    @IsEnum(Evaluation)
    evaluation!: Evaluation;
}

import { IsEnum, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

import { Evaluation } from '@constants/enums';
import { CandidateEntity } from '@entities/candidate.entity';
import { CommonEntity } from '@entities/common.entity';

@Entity()
export class CommentEntity extends CommonEntity {
    @ManyToOne(() => CandidateEntity, ({ comments }) => comments)
    user!: CandidateEntity;

    @Column()
    @IsString()
    content!: string;

    @Column({ enum: Evaluation })
    @IsEnum(Evaluation)
    evaluation!: Evaluation;
}

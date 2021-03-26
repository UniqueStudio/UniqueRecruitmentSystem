import { IsDate, IsString, Matches } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { CandidateEntity } from '@entities/candidate.entity';
import { CommonEntity } from '@entities/common.entity';
import { InterviewEntity } from '@entities/interview.entity';

@Entity('recruitments')
export class RecruitmentEntity extends CommonEntity {
    @Column({ unique: true })
    @IsString()
    @Matches(/^\d{4}[ASC]$/)
    name!: string;

    @Column('timestamptz')
    @IsDate()
    beginning!: Date;

    @Column('timestamptz')
    @IsDate() // TODO: validate `deadline > beginning`
    deadline!: Date;

    @Column('timestamptz')
    @IsDate() // TODO: validate `end > deadline`
    end!: Date;

    @OneToMany(() => InterviewEntity, ({ recruitment }) => recruitment)
    interviews!: InterviewEntity[];

    @OneToMany(() => CandidateEntity, ({ recruitment }) => recruitment)
    candidates!: CandidateEntity[];
}

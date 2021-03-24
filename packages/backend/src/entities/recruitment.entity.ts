import { IsDate, IsString, Matches } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { CandidateEntity } from '@entities/candidate.entity';
import { CommonEntity } from '@entities/common.entity';
import { InterviewEntity } from '@entities/interview.entity';

@Entity()
export class RecruitmentEntity extends CommonEntity {
    @Column({ unique: true })
    @IsString()
    @Matches(/^\d{4}[ASC]$/)
    name!: string;

    @Column('timestamptz')
    @IsDate()
    begin!: Date;

    @Column('timestamptz')
    @IsDate()
    end!: Date;

    @Column('timestamptz')
    @IsDate()
    stop!: Date;

    @OneToMany(() => InterviewEntity, ({ recruitment }) => recruitment)
    interviews!: InterviewEntity[];

    @OneToMany(() => CandidateEntity, ({ recruitment }) => recruitment)
    candidates!: CandidateEntity[];
}

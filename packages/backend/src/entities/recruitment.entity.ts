import { IsDate, IsString, Matches } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { Group, Step } from '@constants/enums';
import { GreaterThan, LessThan } from '@decorators/comparator.decorator';
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
    @IsDate()
    @GreaterThan<RecruitmentEntity>('beginning', { message: '`deadline` must be greater than `beginning`' })
    @LessThan<RecruitmentEntity>('end', { message: '`deadline` must be less than `end`' })
    deadline!: Date;

    @Column('timestamptz')
    @IsDate()
    end!: Date;

    @OneToMany(() => InterviewEntity, ({ recruitment }) => recruitment)
    interviews!: InterviewEntity[];

    @OneToMany(() => CandidateEntity, ({ recruitment }) => recruitment)
    candidates!: CandidateEntity[];

    @Column('jsonb', { nullable: true })
    statistics?: Record<Group, Record<Step, number | undefined> | undefined>;
}

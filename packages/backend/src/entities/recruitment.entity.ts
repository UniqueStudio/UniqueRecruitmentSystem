import { IsDate, IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { CandidateEntity } from '@entities/candidate.entity';
import { CommonEntity } from '@entities/common.entity';
import { InterviewEntity } from '@entities/interview.entity';

@Entity()
export class RecruitmentEntity extends CommonEntity {
    @Column({ unique: true })
    @IsString()
    name!: string;

    @Column('datetime')
    @IsDate()
    begin!: Date;

    @Column('datetime')
    @IsDate()
    end!: Date;

    @Column('datetime')
    @IsDate()
    stop!: Date;

    @OneToMany(() => InterviewEntity, ({ recruitment }) => recruitment)
    interviews!: InterviewEntity[];

    @OneToMany(() => CandidateEntity, ({ recruitment }) => recruitment)
    candidates!: CandidateEntity[];
}

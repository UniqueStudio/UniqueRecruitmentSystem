import { IsDate, IsEnum, IsInt, Min } from 'class-validator';
import { Column, Entity, ManyToMany, ManyToOne, Unique } from 'typeorm';

import { GroupOrTeam, Period } from '@constants/enums';
import { CandidateEntity } from '@entities/candidate.entity';
import { CommonEntity } from '@entities/common.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';

@Entity('interviews')
@Unique(['date', 'period', 'name'])
export class InterviewEntity extends CommonEntity {
    @Column('date')
    @IsDate()
    date!: Date;

    @Column('enum', { enum: Period })
    @IsEnum(Period)
    period!: Period;

    @Column('enum', { enum: GroupOrTeam })
    @IsEnum(GroupOrTeam)
    name!: GroupOrTeam;

    @Column('int')
    @IsInt()
    @Min(0)
    slotNumber!: number;

    @ManyToOne(() => RecruitmentEntity, ({ interviews }) => interviews, { onDelete: 'CASCADE' })
    recruitment!: RecruitmentEntity;

    @ManyToMany(() => CandidateEntity, ({ interviewSelections }) => interviewSelections)
    candidates!: CandidateEntity[];
}

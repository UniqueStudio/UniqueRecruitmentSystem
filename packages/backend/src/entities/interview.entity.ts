import { IInterviewEntity } from '@uniqs/config';
import { IsDate, IsEnum, IsInt, IsPositive } from 'class-validator';
import { Column, Entity, ManyToMany, ManyToOne, Unique } from 'typeorm';

import { GroupOrTeam, Period } from '@constants/enums';
import { ApplicationEntity } from '@entities/application.entity';
import { CommonEntity } from '@entities/common.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';

@Entity('interviews')
@Unique(['date', 'period', 'name'])
export class InterviewEntity extends CommonEntity implements IInterviewEntity {
    @Column('timestamptz')
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
    @IsPositive()
    slotNumber!: number;

    @ManyToOne(() => RecruitmentEntity, ({ interviews }) => interviews, { onDelete: 'CASCADE' })
    recruitment!: RecruitmentEntity;

    @ManyToMany(() => ApplicationEntity, ({ interviewSelections }) => interviewSelections)
    applications!: ApplicationEntity[];
}

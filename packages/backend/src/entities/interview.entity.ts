import { IsDate, IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { Column, Entity, Generated, ManyToOne, PrimaryColumn } from 'typeorm';

import { GroupOrTeam, Period } from '@constants/enums';
import { RecruitmentEntity } from '@entities/recruitment.entity';

@Entity('interviews')
export class InterviewEntity {
    @PrimaryColumn('date')
    @IsDate()
    date!: Date;

    @PrimaryColumn({ enum: Period })
    @IsEnum(Period)
    period!: Period;

    @PrimaryColumn({ enum: GroupOrTeam })
    @IsEnum(GroupOrTeam)
    name!: GroupOrTeam;

    @Generated('uuid')
    @IsOptional()
    @IsUUID(4)
    id!: string;

    @Column('int')
    @IsInt()
    @Min(0)
    slotNumber!: number;

    @ManyToOne(() => RecruitmentEntity, ({ interviews }) => interviews)
    recruitment!: RecruitmentEntity;
}

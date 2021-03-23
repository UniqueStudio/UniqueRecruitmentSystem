import { IsDate, IsEnum, IsNumber, Min } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { GroupOrTeam, Period } from '@constants/enums';
import { RecruitmentEntity } from '@entities/recruitment.entity';

class Slots {
    @Column('int')
    @IsNumber()
    @Min(0)
    total!: number;

    @Column('int')
    @IsNumber()
    @Min(0)
    occupied!: number;
}

@Entity()
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

    @Column(() => Slots)
    slots!: Slots;

    @ManyToOne(() => RecruitmentEntity, ({ interviews }) => interviews)
    recruitment!: RecruitmentEntity;
}

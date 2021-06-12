import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, Unique } from 'typeorm';

import { Grade, Group, Rank, Step } from '@constants/enums';
import { CandidateEntity } from '@entities/candidate.entity';
import { CommentEntity } from '@entities/comment.entity';
import { CommonEntity } from '@entities/common.entity';
import { InterviewEntity } from '@entities/interview.entity';
import { RecruitmentEntity } from '@entities/recruitment.entity';

class InterviewAllocations {
    @Column('timestamptz', { nullable: true })
    @IsOptional()
    @IsDate()
    group?: Date;

    @Column('timestamptz', { nullable: true })
    @IsOptional()
    @IsDate()
    team?: Date;
}

@Entity('applications')
@Unique(['candidate', 'recruitment'])
export class ApplicationEntity extends CommonEntity {
    @Column('enum', { enum: Grade })
    @IsEnum(Grade)
    grade!: Grade;

    @Column()
    @IsString()
    institute!: string;

    @Column()
    @IsString()
    major!: string;

    @Column('enum', { enum: Rank })
    @IsEnum(Rank)
    rank!: Rank;

    @Column('enum', { enum: Group })
    @IsEnum(Group)
    group!: Group;

    @Column()
    @IsString()
    intro!: string;

    @Column()
    @IsBoolean()
    isQuick!: boolean;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    referrer?: string;

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    resume?: string;

    @Column({ default: false })
    @IsOptional()
    @IsBoolean()
    abandoned!: boolean;

    @Column({ default: false })
    @IsOptional()
    @IsBoolean()
    rejected!: boolean;

    @Column('enum', { default: 0, enum: Step })
    @IsOptional()
    @IsEnum(Step)
    step!: Step;

    @ManyToMany(() => InterviewEntity, ({ applications }) => applications)
    @JoinTable({ name: 'interview_selections' })
    interviewSelections!: InterviewEntity[];

    @Column(() => InterviewAllocations)
    interviewAllocations!: InterviewAllocations;

    @ManyToOne(() => CandidateEntity, ({ applications }) => applications, { onDelete: 'CASCADE' })
    candidate!: CandidateEntity;

    @ManyToOne(() => RecruitmentEntity, ({ applications }) => applications, { onDelete: 'CASCADE' })
    recruitment!: RecruitmentEntity;

    @OneToMany(() => CommentEntity, ({ application }) => application)
    comments!: CommentEntity[];
}

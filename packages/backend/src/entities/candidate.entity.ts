import { IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

import { Gender, Grade, Group, Rank, Step } from '@constants/enums';
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

@Entity('candidates')
export class CandidateEntity extends CommonEntity {
    @Column()
    @IsString()
    name!: string;

    @Column('enum', { enum: Gender })
    @IsEnum(Gender)
    gender!: Gender;

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

    @Column()
    @IsEmail()
    mail!: string;

    @Column()
    @IsPhoneNumber('CN')
    phone!: string;

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

    @ManyToMany(() => InterviewEntity, { cascade: ['remove'] })
    @JoinTable({ name: 'interview_selections' })
    interviewSelections!: InterviewEntity[];

    @Column(() => InterviewAllocations)
    interviewAllocations!: InterviewAllocations;

    @ManyToOne(() => RecruitmentEntity, ({ candidates }) => candidates)
    recruitment!: RecruitmentEntity;

    @OneToMany(() => CommentEntity, ({ candidate }) => candidate)
    comments!: CommentEntity[];
}

import { Evaluation, Gender, Grade, Group, GroupOrTeam, Period, Rank, Status, Step, SMSType } from './enums';

type Modify<New, Old extends { [k in keyof New]: unknown }> = Omit<Old, keyof New> & New;

export interface ICommonEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserEntity extends ICommonEntity {
    name: string;
    password: {
        hash: string;
        salt: string;
    };
    gender: Gender;
    mail?: string;
    phone: string;
}

export interface IApplicationEntity extends ICommonEntity {
    grade: Grade;
    institute: string;
    major: string;
    rank: Rank;
    group: Group;
    intro: string;
    isQuick: boolean;
    referrer?: string;
    resume?: string;
    abandoned: boolean;
    rejected: boolean;
    step: Step;
    interviewAllocations: {
        group?: Date;
        team?: Date;
    };
    interviewSelections: IInterviewEntity[];
    candidate: ICandidateEntity;
    recruitment: IRecruitmetEntity;
    comments: ICommentEntity[];
}

export interface ICandidateEntity extends IUserEntity {
    applications: IApplicationEntity[];
}

export interface ICommentEntity extends ICommonEntity {
    application: IApplicationEntity;
    member: IMemberEntity;
    content: string;
    evaluation: Evaluation;
}

export interface IInterviewEntity extends ICommonEntity {
    date: Date;
    period: Period;
    name: GroupOrTeam;
    slotNumber: number;
    recruitment: IRecruitmetEntity;
    applications: IApplicationEntity[];
}

export interface IMemberEntity extends IUserEntity {
    weChatID: string;
    joinTime: string;
    isCaptain: boolean;
    isAdmin: boolean;
    group: Group;
    avatar?: string;
    comments: ICommentEntity[];
}

export interface IRecruitmetEntity extends ICommonEntity {
    name: string;
    beginning: Date;
    deadline: Date;
    end: Date;
    interviews: IInterviewEntity[];
    applications: IApplicationEntity[];
    statistics?: Record<Group, Record<Step, number | undefined> | undefined>;
}

export type Common = Modify<
    {
        createdAt: string;
        updatedAt: string;
    },
    ICommonEntity
>;

export type User = Modify<
    {
        password: string;
    },
    Omit<IUserEntity, keyof ICommonEntity>
> &
    Common;

export type Candidate = Modify<
    {
        applications: Application[];
    },
    Omit<ICandidateEntity, keyof IUserEntity>
> &
    User;

export type Application = Modify<
    {
        interviewAllocations: {
            group?: string;
            team?: string;
        };
        interviewSelections: Interview[];
        candidate: Candidate;
        recruitment: Recruitment;
        comments: Comment[];
    },
    Omit<IApplicationEntity, keyof ICommonEntity>
> &
    Common;

export type Comment = Modify<
    {
        application: Application;
        member: Member;
    },
    Omit<ICommentEntity, keyof ICommonEntity>
> &
    Common;

export type Member = Modify<
    {
        comments: Comment[];
    },
    Omit<IMemberEntity, keyof IUserEntity>
> &
    User;

export type Interview = Modify<
    {
        date: string;
        recruitment: Recruitment;
        applications: Application[];
    },
    Omit<IInterviewEntity, keyof ICommonEntity>
> &
    Common;

export type Recruitment = Modify<
    {
        beginning: string;
        deadline: string;
        end: string;
        interviews: Interview[];
        applications: Application[];
    },
    Omit<IRecruitmetEntity, keyof ICommonEntity>
> &
    Common;

export interface Code {
    code: string;
}

export interface SMSTemplate {
    type: SMSType;
    current?: Step;
    next?: Step;
    time?: string;
    place?: string;
    rest?: string;
}

interface SuccessResponse<T> {
    status: Status.success | Status.info;
    payload: T;
}

interface FailureResponse {
    status: Status.warning | Status.error;
    message: string;
}

export type R<T = undefined> = SuccessResponse<T> | FailureResponse;

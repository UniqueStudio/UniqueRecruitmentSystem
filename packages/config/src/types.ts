import { Evaluation, Gender, Grade, Group, GroupOrTeam, Period, Rank, Status, Step } from './enums';

export interface Application<T = Date> {
    updatedAt: T;
    id: string;
    candidate: {
        name: string;
        gender: Gender;
        mail: string;
        phone: string;
    };
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
    interviewSelections: Interview<T>[];
    interviewAllocations: {
        group?: T;
        team?: T;
    };
    comments: Comment[];
}

export interface Comment {
    id: string;
    user: Member;
    content: string;
    evaluation: Evaluation;
}

export interface Member {
    id: string;
    weChatID: string;
    name: string;
    password?: string;
    joinTime: string;
    isCaptain: boolean;
    isAdmin: boolean;
    phone: string;
    mail?: string;
    gender: Gender;
    group: Group;
    avatar?: string;
}

export interface Interview<T = Date> {
    id: string;
    date: T;
    period: Period;
    name: GroupOrTeam;
    slotNumber: number;
}

export interface Recruitment<T = Date> {
    id: string;
    name: string;
    beginning: T;
    deadline: T;
    end: T;
    interviews: Interview<T>[];
    statistics?: Record<Group, Record<Step, number | undefined> | undefined>;
}

export interface Message {
    isSelf: boolean;
    name: string;
    time: number;
    isImage: boolean;
    avatar: string;
    content: string;
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

import { Evaluation, Gender, Grade, Group, GroupOrTeam, Period, Rank, Status, Step } from './enums';

interface Common {
    id: string;
    createdAt: string;
    updatedAt: string;
}

interface User extends Common {
    name: string;
    password: string;
    gender: Gender;
    mail?: string;
    phone: string;
}

export interface Candidate extends User {
    applications: Application[];
}

export interface Application extends Common {
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
        group?: string;
        team?: string;
    };
    interviewSelections: Interview[];
    candidate: Candidate;
    recruitment: Recruitment;
    comments: Comment[];
}

export interface Comment extends Common {
    application: Application;
    member: Member;
    content: string;
    evaluation: Evaluation;
}

export interface Member extends User {
    weChatID: string;
    joinTime: string;
    isCaptain: boolean;
    isAdmin: boolean;
    group: Group;
    avatar?: string;
}

export interface Interview extends Common {
    date: string;
    period: Period;
    name: GroupOrTeam;
    slotNumber: number;
    recruitment: Recruitment;
    applications: Application[];
}

export interface Recruitment extends Common {
    name: string;
    beginning: string;
    deadline: string;
    end: string;
    interviews: Interview[];
    applications: Application[];
    statistics?: Record<Group, Record<Step, number | undefined> | undefined>;
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

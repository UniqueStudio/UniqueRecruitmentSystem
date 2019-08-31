import { Document } from 'mongoose';

export interface Payload {
    id: string;
}

export interface FormPayload extends Payload {
    recruitmentId: string;
    step: 'group' | 'team' //group: 组面, team: 群面
    group: Group;
}

export type Group = 'web' | 'lab' | 'ai' | 'game' | 'android' | 'ios' | 'design' | 'pm';
export type Step = 0 | 1 | 2 | 3 | 4 | 5;       // 0-5: from 报名 to 通过
export type Gender = 0 | 1 | 2;                 // 1: Male, 2: Female, 0: Other
export type Grade = 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0-6: from 大一 to 研三
export type Rank = 0 | 1 | 2 | 3 | 4;           // 1: 10%, 2: 25%, 3: 50%, 4: 100%, 0: null
export type Evaluation = 0 | 1 | 2;             // 0: bad, 1: so-so, 2: good

export interface Candidate extends Document {
    name: string;
    gender: Gender;
    grade: Grade;
    institute: string;
    major: string;
    rank: Rank;
    mail: string;
    phone: string;
    group: Group;
    title: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    intro: string;
    isQuick: boolean;
    referrer: string;
    resume: string; // file path
    abandon: boolean;
    rejected: boolean;
    interviews: {
        group: Interview,
        team: Interview
    };
    step: Step;
    comments: Comment[];
}

export interface Comment extends Document {
    uid: string;
    username: string;
    content: string;
    evaluation: Evaluation;
}

export interface User extends Document {
    weChatID: string;
    username: string;
    password?: {
        salt: string;
        hash: string;
    };
    joinTime: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    isCaptain: boolean;
    isAdmin: boolean;
    phone: string;
    mail: string;
    gender: Gender;
    group: Group;
    avatar: string;
}

export interface Time {
    date: number;
    morning: number;
    afternoon: number;
    evening: number;
}

export interface Interview {
    selection: Time[];
    allocation: number;
}

export interface Recruitment extends Document {
    title: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    begin: number;
    end: number;
    stop: number;
    total: number;
    interview: Time[];
    groups: GroupData[];
}

export interface GroupData {
    name: Group;
    total: number;
    steps: number[];
    interview: Time[];
}

export interface Message {
    isSelf: boolean;
    name: string;
    time: number;
    isImage: boolean;
    avatar: string;
    content: string;
}

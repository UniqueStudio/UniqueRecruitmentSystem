import { Document } from 'mongoose';

export interface Payload {
    id: string;
}

export type Group = 'web' | 'lab' | 'ai' | 'game' | 'android' | 'ios' | 'design' | 'pm';

export interface Candidate extends Document {
    name: string;
    gender: 0 | 1 | 2; // TODO: 1: Male, 2: Female, 0: Other, sex -> gender
    grade: 0 | 1 | 2 | 3 | 4 | 5 | 6; // TODO
    institute: string;
    major: string;
    rank: 0 | 1 | 2 | 3 | 4; // TODO: 1: 10%, 2: 25%, 3: 50%, 4: 100%, 0: null, score -> rank
    mail: string;
    phone: string;
    group: Group;
    title: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    intro: string;
    isQuick: boolean;
    referrer: string; // TODO: new
    resume: string; // file path
    abandon: boolean;
    rejected: boolean;
    interviews: { // TODO
        group: Interview,
        team: Interview
    };
    step: 0 | 1 | 2 | 3 | 4 | 5;
    comments: Comment[]; // TODO: object -> array
}

export interface Comment {
    uid: string; // TODO: new
    username: string; // TODO: new
    content: string; // TODO: comment -> content
    evaluation: 2 | 1 | 0; // TODO: 2: good, 1: so-so, 0: bad
}

export interface User extends Document {
    weChatID: string;
    username: string;
    joinTime: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    isCaptain: boolean;
    isAdmin: boolean;
    phone: string;
    mail: string;
    gender: 0 | 1 | 2; // TODO: 1: Male, 2: Female, 0: Other, sex -> gender
    group: Group;
    avatar?: string;
}

export interface Time {
    date: string;
    morning: number; // TODO: boolean to number
    afternoon: number;
    evening: number;
}

export interface Interview {
    selection: Time[];
    allocation: Allocation;
}

export interface Allocation {
    date: string;
    period: 0 | 1 | 2; // 0: morning, 1: afternoon, 2: evening
    time: string;
}

export interface Recruitment extends Document {
    title: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    begin: string; // TODO: timestamp should be string
    end: string; // TODO: timestamp should be string
    total: number;
    interview: Time[]; // TODO: Team Interview
    groups: GroupData[];
}

export interface GroupData {
    name: Group;
    total: number;
    steps: number[];
    interview: Time[]; // TODO: Group Interview
}

export interface Message {
    isSelf: boolean;
    name: string;
    time: string; // TODO: timestamp should be string
    type: string;
    avatar: string;
    message: string;
}

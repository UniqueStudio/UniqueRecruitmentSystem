export type Group = 'web' | 'lab' | 'ai' | 'game' | 'android' | 'ios' | 'design' | 'pm';
export type Gender = 0 | 1 | 2; // 1: Male, 2: Female, 0: Other
export type Grade = 0 | 1 | 2 | 3; // 0-3: from 大一 to 大四
export type Rank = 0 | 1 | 2 | 3 | 4; // 1: 10%, 2: 25%, 3: 50%, 4: 100%, 0: null
export type Step = 0 | 1 | 2 | 3 | 4 | 5; // 0-5: from 报名 to 通过
export type MessageType = 'success' | 'warning' | 'error' | 'info';

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

export interface CandidateForm {
    name: string;
    gender: Gender;
    grade: Grade;
    institute: string;
    major: string;
    rank: Rank;
    mail: string;
    phone: string; // jwt will have phone field.
    group: Group;
    title: string;
    intro: string;
    isQuick: boolean;
    referrer: string;
    resume: string | File | FileList;
    // code: string; we don't need code field in dashboard
}

export interface Candidate extends CandidateForm {
    abandon: boolean;
    rejected: boolean;
    interviews: {
        group: Interview;
        team: Interview;
    };
    step: Step;
}

export interface Recruitment {
    title: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    begin: number;
    end: number;
    stop: number;
}

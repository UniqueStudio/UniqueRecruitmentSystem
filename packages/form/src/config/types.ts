export type Group = 'web' | 'lab' | 'ai' | 'game' | 'android' | 'ios' | 'design' | 'pm';
export type Gender = 0 | 1 | 2;                 // 1: Male, 2: Female, 0: Other
export type Grade = 0 | 1 | 2 | 3 | 4 | 5 | 6;  // 0-6: from 大一 to 研三
export type Rank = 0 | 1 | 2 | 3 | 4;           // 1: 10%, 2: 25%, 3: 50%, 4: 100%, 0: null
export type Variant = 'success' | 'warning' | 'error' | 'info';

export interface Candidate {
    name: string;
    gender: Gender;
    grade: Grade;
    institute: string;
    major: string;
    rank: Rank;
    mail: string;
    phone: string;
    group: Group;
    title: string;
    intro: string;
    isQuick: boolean;
    referrer: string;
    resume: string;
    code: string;
}

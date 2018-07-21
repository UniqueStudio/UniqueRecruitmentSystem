export const GROUP = ['Web', 'Lab', 'AI', 'Game', 'Android', 'iOS', 'Design', 'PM'];
export const STEP = ['报名流程', '笔试流程', '面试流程', '熬测流程', '群面流程', '通过'];
export const URL = 'http://localhost:5000';

export interface Candidate {
    name: string;
    grade: string;
    institute: string;
    major: string;
    score: "10%" | "25%" | "50%" | "100%";
    mail: string;
    phone: string;
    abandon?: boolean;
    time1: string;
    time2: string;
    group: string;
    sex: "Male" | "Female";
    title: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    step: number;
    intro: string;
    resume: string; // file path
    comments: object;
}
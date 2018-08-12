export const GROUP = ['Web', 'Lab', 'AI', 'Game', 'Android', 'iOS', 'Design', 'PM'];
export const STEP = ['报名流程', '笔试流程', '面试流程', '熬测流程', '群面流程', '通过'];
export const URL = 'http://39.108.175.151:5000';
export const QR_CODE_URL = 'https://open.work.weixin.qq.com/wwopen/sso/qrImg?key=';

type Group = "web" | "lab" | "ai" | "game" | "android" | "ios" | "design" | "pm";

export interface Candidate {
    _id: string;
    name: string;
    grade: string;
    institute: string;
    major: string;
    score: "前10%" | "前25%" | "前50%" | "前100%" | "暂无";
    mail: string;
    phone: string;
    abandon?: boolean;
    time1?: object[];
    slot1?: string[];
    time2?: object[];
    slot2?: string[];
    group: Group;
    sex: "Male" | "Female";
    title: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    step: number;
    intro: string;
    resume: string; // file path
    comments: {
        [uid: string]: Comment;
    };
    rejected?: boolean;
}

export interface Comment {
    comment: string;
    evaluation: "good" | "so-so" | "bad";
}

export interface User {
    uid: string;
    username: string;
    joinTime: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    isCaptain: boolean;
    isAdmin: boolean;
    phone: string;
    mail: string;
    sex: "Male" | "Female";
    group: Group;
    avatar: string;
}

export interface Data {
    group: Group;
    total: number;
    steps: number[];
}

export interface Time {
    date: string;
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
}

export interface Recruitment {
    title: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    begin: number;
    end: number;
    total: number;
    time2: Time[];
    time1: object;
    data: Data[];
}

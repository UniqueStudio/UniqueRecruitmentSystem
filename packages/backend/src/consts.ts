import { ObjectID } from 'mongodb';

export const GROUPS = ["web", "lab", "ai", "game", "android", "ios", "design", "pm"];
export const secret = 'Uniq';
export const getQRCodeURL = 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=ww6879e683e04c1e57&agentid=1000011&redirect_uri=https%3A%2F%2Fopen.hustunique.com%2Fauth&state=api';
export const scanningURL = 'https://open.work.weixin.qq.com/wwopen/sso/l/qrConnect?key=';
export const accessTokenURL = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ww6879e683e04c1e57&corpsecret=eLaMPIwkvX6zpKH-ghotTA8rfKq-071D9-fi35ecGe8';
export const userIDURL = (accessToken: string, code: string) => `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${accessToken}&code=${code}`;
export const userInfoURL = (accessToken: string, uid: string) => `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${accessToken}&userid=${uid}`;
export const smsSendURL = `https://open.hustunique.com/weixin/sms`;
export const token = `fG1NrQwAmu9gJv24QwbuBnFu7LheL0cl17luvGby4K34wNy5-pldpK3_v8XGvLUari9_YK0LLuNajOmsW8VWQQ`;

export interface Candidate {
    _id: ObjectID;
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

type group = "web" | "lab" | "ai" | "game" | "android" | "ios" | "design" | "pm";

interface Data {
    group: group;
    total: number;
    steps: number[];
}

export interface Recruitment {
    _id: ObjectID;
    title: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    begin: number;
    end: number;
    total: number;
    time2: object[];
    time1: {
        web: object[];
        // etc
    }
    data: Data[];
}

export interface User {
    _id: ObjectID;
    name: string;
    joinTime: string; // e.g. 2018A || 2018S (A: AUTUMN, S: SPRING, C: CAMP)
    isCaptain: boolean;
    isAdmin: boolean;
    phone: string;
    mail: string;
    sex: "Male" | "Female";
    group: group;
}
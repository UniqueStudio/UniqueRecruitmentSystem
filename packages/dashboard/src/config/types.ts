export interface Message {
    isSelf: boolean;
    name: string;
    time: number;
    isImage: boolean;
    avatar: string;
    content: string;
}

export type { Application, Interview, R, Recruitment, Member, Candidate, Comment } from '@uniqs/config';

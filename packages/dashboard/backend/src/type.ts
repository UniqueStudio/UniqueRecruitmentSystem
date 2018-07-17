import { ObjectID } from 'mongodb';

export interface Candidate {
    _id: ObjectID;
    name: string;
    grade: string;
    institute: string;
    abandon?: boolean;
    group: string;
    step: string;
    comments: object;
}
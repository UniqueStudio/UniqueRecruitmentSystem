import { model } from 'mongoose';
import { EVALUATIONS, GENDERS, GRADES, GROUPS_, RANKS, STEPS } from '../config/consts';
import { Candidate, Recruitment, User } from '../config/types';
import { createSchema, RepositoryBase } from './index';

const arrayToIndex = (array: string[]) => array.map((i, j) => j);

const commentSchema = createSchema({
    uid: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    evaluation: {
        type: Number,
        required: true,
        enum: arrayToIndex(EVALUATIONS)
    }
});

const timeSchema = createSchema({
    date: {
        type: Number,
        required: true
    },
    morning: {
        type: Number,
        required: true
    },
    afternoon: {
        type: Number,
        required: true
    },
    evening: {
        type: Number,
        required: true
    }
}, false);

const interviewSchema = createSchema({
    selection: {
        type: [timeSchema],
    },
    allocation: {
        type: Number,
    }
}, false);

const candidateSchema = createSchema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: Number,
        required: true,
        enum: arrayToIndex(GENDERS),
        alias: 'sex'
    },
    grade: {
        type: Number,
        required: true,
        enum: arrayToIndex(GRADES),
    },
    institute: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        required: true,
        enum: arrayToIndex(RANKS),
        alias: 'score'
    },
    mail: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    group: {
        type: String,
        required: true,
        enum: GROUPS_,
        lowercase: true,
    },
    abandon: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    },
    interviews: {
        group: {
            type: interviewSchema,
            default: interviewSchema
        },
        team: {
            type: interviewSchema,
            default: interviewSchema
        },
    },
    title: {
        type: String,
        required: true
    },
    step: {
        type: Number,
        enum: arrayToIndex(STEPS),
        default: 0
    },
    intro: {
        type: String,
        required: true
    },
    isQuick: {
        type: Boolean,
        required: true
    },
    resume: {
        type: String,
        default: ''
    },
    comments: {
        type: [commentSchema],
        default: []
    },
    referrer: {
        type: String
    }
});

const CandidateModel = model<Candidate>('candidate', candidateSchema);
export const CandidateRepo = new RepositoryBase<Candidate>(CandidateModel);

const userSchema = createSchema({
    weChatID: {
        type: String,
        required: true
    },
    password: {
        hash: String,
        salt: String,
    },
    username: {
        type: String,
        required: true
    },
    joinTime: {
        type: String,
        required: true
    },
    isCaptain: {
        type: Boolean,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        default: ''
    },
    gender: {
        type: Number,
        required: true,
        enum: arrayToIndex(GENDERS),
        alias: 'sex'
    },
    group: {
        type: String,
        required: true,
        lowercase: true,
        enum: GROUPS_
    },
    avatar: {
        type: String,
        default: ''
    },
});

const UserModel = model<User>('user', userSchema);
export const UserRepo = new RepositoryBase<User>(UserModel);

const groupDataSchema = createSchema({
    name: {
        type: String,
        required: true,
        enum: GROUPS_,
        lowercase: true,
    },
    total: {
        type: Number,
        default: 0
    },
    steps: {
        type: [Number],
        default: STEPS.map(() => 0)
    },
    interview: {
        type: [timeSchema],
    }
}, false);

const recruitmentSchema = createSchema({
    title: {
        type: String,
        required: true
    },
    begin: {
        type: Number,
        required: true
    },
    end: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        default: 0
    },
    interview: {
        type: [timeSchema],
    },
    groups: {
        type: [groupDataSchema],
        required: true
    }
});

const RecruitmentModel = model<Recruitment>('recruitment', recruitmentSchema);
export const RecruitmentRepo = new RepositoryBase<Recruitment>(RecruitmentModel);

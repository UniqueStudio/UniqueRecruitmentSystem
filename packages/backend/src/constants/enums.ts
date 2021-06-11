export enum Env {
    dev = 'development',
    prod = 'production',
    test = 'test',
    migration = 'migration',
}

export enum Role {
    admin = 0b100,
    member = 0b010,
    candidate = 0b001,
}

export {
    Group,
    Gender,
    Grade,
    Step,
    GroupOrTeam,
    Period,
    Rank,
    Status,
    SMSType,
    Evaluation,
    InterviewType,
} from '@uniqs/config';

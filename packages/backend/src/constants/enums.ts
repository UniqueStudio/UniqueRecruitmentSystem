export enum Env {
    dev = 'development',
    prod = 'production',
    test = 'test',
    migration = 'migration',
}

export enum Group {
    web = 'web',
    lab = 'lab',
    ai = 'ai',
    game = 'game',
    android = 'android',
    ios = 'ios',
    design = 'design',
    pm = 'pm',
}

export enum GroupOrTeam {
    web = 'web',
    lab = 'lab',
    ai = 'ai',
    game = 'game',
    android = 'android',
    ios = 'ios',
    design = 'design',
    pm = 'pm',
    unique = 'unique',
}

export enum Period {
    morning,
    afternoon,
    evening,
}

// Feel free to submit a pull request if you can express ALL of them in NATIVE English
export enum Step {
    报名,
    笔试,
    组面时间选择,
    组面,
    熬测,
    群面时间选择,
    群面,
    通过,
}

export enum Gender {
    other,
    male,
    female,
}

export enum Grade {
    freshman,
    sophomore,
    junior,
    senior,
    graduate,
}

export enum Rank {
    unknown,
    A,
    B,
    C,
    D,
}

export enum Evaluation {
    poor,
    fair,
    good,
}

export enum InterviewType {
    group = 'group',
    team = 'team',
}

export enum Status {
    info = 'info',
    success = 'success',
    warning = 'warning',
    error = 'error',
}

export enum Role {
    admin,
    user,
    candidate,
}

export enum SMSType {
    accept = 'accept',
    reject = 'reject',
}

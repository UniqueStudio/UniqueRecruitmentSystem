declare namespace NodeJS {
    interface Global {
        acmConfig: Questions
    }
    interface ProcessEnv {
        NODE_ENV: string;
        APP_ID: string;
        AGENT_ID: string;
        REDIRECT_URI: string;
        CORP_ID: string;
        CORP_SECRET: string;
        TOKEN: string;
        DB_PORT: string;
        SECRET: string;
        ACM_DATAID: string;
        ACM_GROUP: string;
        ACM_NAMESPACE: string;
        ACM_ACCESS_KEY: string;
        ACM_SECRET_KEY: string;
    }
}
interface Question {
    description: string;
    uri: string;
}

interface Questions {
    web: Question;
    pm: Question;
    game: Question;
    android: Question;
    ai: Question;
    ios: Question;
    lab: Question;
    design: Question;
}

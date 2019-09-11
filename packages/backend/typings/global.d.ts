declare module NodeJS {
    interface Global {
        acmConfig: Questions
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
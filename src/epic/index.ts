import { combineEpics } from "redux-observable";
import userEpic from './user';
import candidateEpic from './candidate';

export const customError = (obj: object) => {
    const err = new Error(obj['message']);
    err['type'] = obj['type'];
    return err;
};

export function actionTypeCreator(action: string) {
    return {
        START: `${action}_START`,
        SUCCESS: `${action}_SUCCESS`,
        FAILURE: `${action}_FAILURE`,
    }
}

export const epics = combineEpics(...userEpic, ...candidateEpic);
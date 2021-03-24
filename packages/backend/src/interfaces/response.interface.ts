import { Status } from '@constants/enums';

export interface SuccessResponse<T> {
    status: Status.success | Status.info;
    payload: T;
}

export interface FailureResponse {
    status: Status.warning | Status.error;
    message: string;
}

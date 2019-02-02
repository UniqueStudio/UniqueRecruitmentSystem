import { OptionsObject } from 'notistack';
import { Candidate, Comment, Evaluation, Group, Message, Recruitment, Step, Time, User } from '../config/types';

export const SOCKET_START = 'SOCKET_START';
export type SOCKET_START = typeof SOCKET_START;

export interface SocketStart {
    type: SOCKET_START;
}

export function socketStart(): SocketStart {
    return {
        type: SOCKET_START
    };
}

export const TOGGLE_PROGRESS = 'TOGGLE_PROGRESS';
export type TOGGLE_PROGRESS = typeof TOGGLE_PROGRESS;

export interface ToggleProgress {
    type: TOGGLE_PROGRESS;
    on: boolean;
}

export function toggleProgress(on = false): ToggleProgress {
    return {
        type: TOGGLE_PROGRESS,
        on
    };
}

export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export type TOGGLE_DRAWER = typeof TOGGLE_DRAWER;

export interface ToggleDrawer {
    type: TOGGLE_DRAWER;
}

export function toggleDrawer(): ToggleDrawer {
    return {
        type: TOGGLE_DRAWER,
    };
}

export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export type ENQUEUE_SNACKBAR = typeof ENQUEUE_SNACKBAR;

export interface EnqueueSnackbar {
    type: ENQUEUE_SNACKBAR;
    notification: {
        key: number;
        message: string;
        options?: OptionsObject;
    };
}

export function enqueueSnackbar(message: string, options?: OptionsObject): EnqueueSnackbar {
    return {
        type: ENQUEUE_SNACKBAR,
        notification: {
            key: new Date().getTime() + Math.random(),
            message,
            options
        }
    };
}

export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';
export type REMOVE_SNACKBAR = typeof REMOVE_SNACKBAR;

export interface RemoveSnackbar {
    type: REMOVE_SNACKBAR;
    key: number;
}

export function removeSnackbar(key: number): RemoveSnackbar {
    return {
        type: REMOVE_SNACKBAR,
        key
    };
}

export const TOGGLE_FAB_ON = 'TOGGLE_FAB_ON';
export type TOGGLE_FAB_ON = typeof TOGGLE_FAB_ON;

export interface ToggleFabOn {
    type: TOGGLE_FAB_ON;
    step: number;
}

export function toggleFabOn(step: number): ToggleFabOn {
    return {
        type: TOGGLE_FAB_ON,
        step,
    };
}

export const TOGGLE_FAB_OFF = 'TOGGLE_FAB_OFF';
export type TOGGLE_FAB_OFF = typeof TOGGLE_FAB_OFF;

export interface ToggleFabOff {
    type: TOGGLE_FAB_OFF;
}

export function toggleFabOff(): ToggleFabOff {
    return {
        type: TOGGLE_FAB_OFF,
    };
}

export const RECORD_INPUTTING_COMMENT = 'RECORD_INPUTTING_COMMENT';
export type RECORD_INPUTTING_COMMENT = typeof RECORD_INPUTTING_COMMENT;

export interface RecordInputtingComment {
    type: RECORD_INPUTTING_COMMENT;
    content: string;
    evaluation: Evaluation;
}

export function recordInputtingComment(content: string, evaluation: Evaluation): RecordInputtingComment {
    return {
        type: RECORD_INPUTTING_COMMENT,
        content,
        evaluation,
    };
}

export const ADD_COMMENT_START = 'ADD_COMMENT_START';
export type ADD_COMMENT_START = typeof ADD_COMMENT_START;

export interface AddCommentStart {
    type: ADD_COMMENT_START;
    cid: string;
    comment: Partial<Comment>;
}

export function addCommentStart(cid: string, comment: Partial<Comment>): AddCommentStart {
    return {
        type: ADD_COMMENT_START,
        cid,
        comment,
    };
}

export const ADD_COMMENT_FULFILLED = 'ADD_COMMENT_FULFILLED';
export type ADD_COMMENT_FULFILLED = typeof ADD_COMMENT_FULFILLED;

export interface AddCommentFulfilled {
    type: ADD_COMMENT_FULFILLED;
    cid: string;
    comment: Comment;
}

export function addCommentFulfilled(cid: string, comment: Comment): AddCommentFulfilled {
    return {
        type: ADD_COMMENT_FULFILLED,
        cid,
        comment,
    };
}

export const REMOVE_COMMENT_START = 'REMOVE_COMMENT_START';
export type REMOVE_COMMENT_START = typeof REMOVE_COMMENT_START;

export interface RemoveCommentStart {
    type: REMOVE_COMMENT_START;
    cid: string;
    id: string;
}

export function removeCommentStart(cid: string, id: string): RemoveCommentStart {
    return {
        type: REMOVE_COMMENT_START,
        cid,
        id,
    };
}

export const REMOVE_COMMENT_FULFILLED = 'REMOVE_COMMENT_FULFILLED';
export type REMOVE_COMMENT_FULFILLED = typeof REMOVE_COMMENT_FULFILLED;

export interface RemoveCommentFulfilled {
    type: REMOVE_COMMENT_FULFILLED;
    cid: string;
    id: string;
}

export function removeCommentFulfilled(cid: string, id: string): RemoveCommentFulfilled {
    return {
        type: REMOVE_COMMENT_FULFILLED,
        cid,
        id,
    };
}

export const GET_CANDIDATES_START = 'GET_CANDIDATES_START';
export type GET_CANDIDATES_START = typeof GET_CANDIDATES_START;

export interface GetCandidatesStart {
    type: GET_CANDIDATES_START;
    title: string;
    group?: Group;
    step?: number;
}

export function getCandidatesStart(title: string, group?: Group, step?: number): GetCandidatesStart {
    return {
        type: GET_CANDIDATES_START,
        title,
        group,
        step
    };
}

export const GET_CANDIDATES_FULFILLED = 'GET_CANDIDATES_FULFILLED';
export type GET_CANDIDATES_FULFILLED = typeof GET_CANDIDATES_FULFILLED;

export interface GetCandidatesFulfilled {
    type: GET_CANDIDATES_FULFILLED;
    candidates: Candidate[];
}

export function getCandidatesFulfilled(candidates: Candidate[]): GetCandidatesFulfilled {
    return {
        type: GET_CANDIDATES_FULFILLED,
        candidates,
    };
}

export const GET_RESUME = 'GET_RESUME';
export type GET_RESUME = typeof GET_RESUME;

export interface GetResume {
    type: GET_RESUME;
    cid: string;
}

export function getResume(cid: string): GetResume {
    return {
        type: GET_RESUME,
        cid,
    };
}

export const ADD_CANDIDATE_FULFILLED = 'ADD_CANDIDATE_FULFILLED';
export type ADD_CANDIDATE_FULFILLED = typeof ADD_CANDIDATE_FULFILLED;

export interface AddCandidateFulfilled {
    type: ADD_CANDIDATE_FULFILLED;
    group: Group;
    candidate: Candidate;
}

export function addCandidateFulfilled(group: Group, candidate: Candidate): AddCandidateFulfilled {
    return {
        type: ADD_CANDIDATE_FULFILLED,
        group,
        candidate
    };
}

export const SELECT_CANDIDATE = 'SELECT_CANDIDATE';
export type SELECT_CANDIDATE = typeof SELECT_CANDIDATE;

export interface SelectCandidate {
    type: SELECT_CANDIDATE;
    cid: string | string[];
}

export function selectCandidate(cid: string | string[]): SelectCandidate {
    return {
        type: SELECT_CANDIDATE,
        cid,
    };
}

export const DESELECT_CANDIDATE = 'DESELECT_CANDIDATE';
export type DESELECT_CANDIDATE = typeof DESELECT_CANDIDATE;

export interface DeselectCandidate {
    type: DESELECT_CANDIDATE;
    cid: string | string[];
}

export function deselectCandidate(cid: string | string[]): DeselectCandidate {
    return {
        type: DESELECT_CANDIDATE,
        cid,
    };
}

export const REMOVE_CANDIDATE_START = 'REMOVE_CANDIDATE_START';
export type REMOVE_CANDIDATE_START = typeof REMOVE_CANDIDATE_START;

export interface RemoveCandidateStart {
    type: REMOVE_CANDIDATE_START;
    cid: string | string[];
}

export function removeCandidateStart(cid: string | string[]): RemoveCandidateStart {
    return {
        type: REMOVE_CANDIDATE_START,
        cid,
    };
}

export const REMOVE_CANDIDATE_FULFILLED = 'REMOVE_CANDIDATE_FULFILLED';
export type REMOVE_CANDIDATE_FULFILLED = typeof REMOVE_CANDIDATE_FULFILLED;

export interface RemoveCandidateFulfilled {
    type: REMOVE_CANDIDATE_FULFILLED;
    cid: string | string[];
}

export function removeCandidateFulfilled(cid: string | string[]): RemoveCandidateFulfilled {
    return {
        type: REMOVE_CANDIDATE_FULFILLED,
        cid,
    };
}

export const MOVE_CANDIDATE_START = 'MOVE_CANDIDATE_START';
export type MOVE_CANDIDATE_START = typeof MOVE_CANDIDATE_START;

export interface MoveCandidateStart {
    type: MOVE_CANDIDATE_START;
    from: Step;
    to: Step;
    cid: string;
    position?: number;
}

export function moveCandidateStart(from: Step, to: Step, cid: string, position?: number): MoveCandidateStart {
    return {
        type: MOVE_CANDIDATE_START,
        from,
        to,
        cid,
        position,
    };
}

export const MOVE_CANDIDATE_FULFILLED = 'MOVE_CANDIDATE_FULFILLED';
export type MOVE_CANDIDATE_FULFILLED = typeof MOVE_CANDIDATE_FULFILLED;

export interface MoveCandidateFulfilled {
    type: MOVE_CANDIDATE_FULFILLED;
    from: Step;
    to: Step;
    cid: string;
    position?: number;
}

export function moveCandidateFulfilled(from: Step, to: Step, cid: string, position?: number): MoveCandidateFulfilled {
    return {
        type: MOVE_CANDIDATE_FULFILLED,
        from,
        to,
        cid,
        position,
    };
}

export const ALLOCATE_ONE_START = 'SET_ONE_SLOT_START';
export type ALLOCATE_ONE_START = typeof ALLOCATE_ONE_START;

export interface AllocateOneStart {
    type: ALLOCATE_ONE_START;
    cid: string;
    time: number;
    interviewType: 'group' | 'team';
}

export function allocateOneStart(cid: string, time: number, interviewType: 'group' | 'team'): AllocateOneStart {
    return {
        type: ALLOCATE_ONE_START,
        cid,
        time,
        interviewType
    };
}

export const ALLOCATE_ONE_FULFILLED = 'ALLOCATE_ONE_FULFILLED';
export type ALLOCATE_ONE_FULFILLED = typeof ALLOCATE_ONE_FULFILLED;

export interface AllocateOneFulfilled {
    type: ALLOCATE_ONE_FULFILLED;
    cid: string;
    time: number;
    interviewType: 'group' | 'team';
}

export function allocateOneFulfilled(cid: string, time: number, interviewType: 'group' | 'team'): AllocateOneFulfilled {
    return {
        type: ALLOCATE_ONE_FULFILLED,
        cid,
        time,
        interviewType
    };
}

export const ALLOCATE_ALL_START = 'SET_ALL_SLOT_START';
export type ALLOCATE_ALL_START = typeof ALLOCATE_ALL_START;

export interface AllocateAllStart {
    type: ALLOCATE_ALL_START;
    interviewType: 'group' | 'team';
}

export function allocateAllStart(interviewType: 'group' | 'team'): AllocateAllStart {
    return {
        type: ALLOCATE_ALL_START,
        interviewType
    };
}

export const ALLOCATE_ALL_FULFILLED = 'ALLOCATE_ALL_FULFILLED';
export type ALLOCATE_ALL_FULFILLED = typeof ALLOCATE_ALL_FULFILLED;

export interface AllocateAllFulfilled {
    type: ALLOCATE_ALL_FULFILLED;
    data: {
        id: string;
        time: number;
    }[];
    interviewType: 'group' | 'team';
}

export function allocateAllFulfilled(data: AllocateAllFulfilled['data'], interviewType: 'group' | 'team'): AllocateAllFulfilled {
    return {
        type: ALLOCATE_ALL_FULFILLED,
        data,
        interviewType
    };
}

export const SET_GROUP = 'SET_GROUP';
export type SET_GROUP = typeof SET_GROUP;

export interface SetGroup {
    type: SET_GROUP;
    group: Group;
}

export function setGroup(group: Group): SetGroup {
    return {
        type: SET_GROUP,
        group,
    };
}

export const SET_STEPS = 'SET_STEPS';
export type SET_STEPS = typeof SET_STEPS;

export interface SetSteps {
    type: SET_STEPS;
    stepType: number;
}

export function setSteps(stepType: number): SetSteps {
    return {
        type: SET_STEPS,
        stepType,
    };
}

export const LOGIN = 'LOGIN';
export type LOGIN = typeof LOGIN;

export interface Login {
    type: LOGIN;
    token: string;
}

export function login(token: string): Login {
    return {
        type: LOGIN,
        token
    };
}

export const LOGOUT = 'LOGOUT';
export type LOGOUT = typeof LOGOUT;

export interface Logout {
    type: LOGOUT;
}

export function logout(): Logout {
    return {
        type: LOGOUT,
    };
}

export const GET_QR_CODE_START = 'GET_QR_CODE_START';
export type GET_QR_CODE_START = typeof GET_QR_CODE_START;

export interface GetQRCodeStart {
    type: GET_QR_CODE_START;
}

export function getQRCodeStart(): GetQRCodeStart {
    return {
        type: GET_QR_CODE_START,
    };
}

export const GET_QR_CODE_FULFILLED = 'GET_QR_CODE_FULFILLED';
export type GET_QR_CODE_FULFILLED = typeof GET_QR_CODE_FULFILLED;

export interface GetQRCodeFulfilled {
    type: GET_QR_CODE_FULFILLED;
    key: string;
}

export function getQRCodeFulfilled(key: string): GetQRCodeFulfilled {
    return {
        type: GET_QR_CODE_FULFILLED,
        key,
    };
}

export const GET_USER_INFO_START = 'GET_USER_INFO_START';
export type GET_USER_INFO_START = typeof GET_USER_INFO_START;

export interface GetUserInfoStart {
    type: GET_USER_INFO_START;
}

export function getUserInfoStart(): GetUserInfoStart {
    return {
        type: GET_USER_INFO_START,
    };
}

export const SET_USER_INFO_START = 'SET_USER_INFO_START';
export type SET_USER_INFO_START = typeof SET_USER_INFO_START;

export interface SetUserInfoStart {
    type: SET_USER_INFO_START;
    info: {
        phone: string,
        mail: string
    };
}

export function setUserInfoStart(info: { phone: string, mail: string }): SetUserInfoStart {
    return {
        type: SET_USER_INFO_START,
        info,
    };
}

export const USER_INFO_FULFILLED = 'USER_INFO_FULFILLED';
export type USER_INFO_FULFILLED = typeof USER_INFO_FULFILLED;

export interface UserInfoFulfilled {
    type: USER_INFO_FULFILLED;
    info: object;
}

export function userInfoFulfilled(info: object): UserInfoFulfilled {
    return {
        type: USER_INFO_FULFILLED,
        info,
    };
}

export const GET_GROUP_INFO_START = 'GET_GROUP_INFO_START';
export type GET_GROUP_INFO_START = typeof GET_GROUP_INFO_START;

export interface GetGroupInfoStart {
    type: GET_GROUP_INFO_START;
}

export function getGroupInfoStart(): GetGroupInfoStart {
    return {
        type: GET_GROUP_INFO_START,
    };
}

export const GET_GROUP_INFO_FULFILLED = 'GET_GROUP_INFO_FULFILLED';
export type GET_GROUP_INFO_FULFILLED = typeof GET_GROUP_INFO_FULFILLED;

export interface GetGroupInfoFulfilled {
    type: GET_GROUP_INFO_FULFILLED;
    info: User[];
}

export function getGroupInfoFulfilled(info: User[]): GetGroupInfoFulfilled {
    return {
        type: GET_GROUP_INFO_FULFILLED,
        info,
    };
}

export const GET_RECRUITMENTS_START = 'GET_RECRUITMENTS_START';
export type GET_RECRUITMENTS_START = typeof GET_RECRUITMENTS_START;

export interface GetRecruitmentsStart {
    type: GET_RECRUITMENTS_START;
}

export function getRecruitmentsStart(): GetRecruitmentsStart {
    return {
        type: GET_RECRUITMENTS_START,
    };
}

export const GET_RECRUITMENTS_FULFILLED = 'GET_RECRUITMENTS_FULFILLED';
export type GET_RECRUITMENTS_FULFILLED = typeof GET_RECRUITMENTS_FULFILLED;

export interface GetRecruitmentsFulfilled {
    type: GET_RECRUITMENTS_FULFILLED;
    recruitments: Recruitment[];
}

export function getRecruitmentsFulfilled(recruitments: Recruitment[]): GetRecruitmentsFulfilled {
    return {
        type: GET_RECRUITMENTS_FULFILLED,
        recruitments,
    };
}

export const LAUNCH_RECRUITMENT = 'LAUNCH_RECRUITMENT';
export type LAUNCH_RECRUITMENT = typeof LAUNCH_RECRUITMENT;

export interface LaunchRecruitment {
    type: LAUNCH_RECRUITMENT;
    info: Partial<Recruitment>;
}

export function launchRecruitment(info: Partial<Recruitment>): LaunchRecruitment {
    return {
        type: LAUNCH_RECRUITMENT,
        info,
    };
}

export const SET_RECRUITMENT = 'SET_RECRUITMENT';
export type SET_RECRUITMENT = typeof SET_RECRUITMENT;

export interface SetRecruitment {
    type: SET_RECRUITMENT;
    data: {
        title: string,
        begin: number,
        end: number,
        group?: Group,
        groupInterview?: Time[],
        teamInterview?: Time[]
    };
}

export function setRecruitment(data: SetRecruitment['data']): SetRecruitment {
    return {
        type: SET_RECRUITMENT,
        data,
    };
}

export const SET_VIEWING_RECRUITMENT_START = 'SET_VIEWING_RECRUITMENT_START';
export type SET_VIEWING_RECRUITMENT_START = typeof SET_VIEWING_RECRUITMENT_START;

export interface SetViewingRecruitmentStart {
    type: SET_VIEWING_RECRUITMENT_START;
    title: string;
}

export function setViewingRecruitmentStart(title: string): SetViewingRecruitmentStart {
    return {
        type: SET_VIEWING_RECRUITMENT_START,
        title
    };
}

export const SET_VIEWING_RECRUITMENT_FULFILLED = 'SET_VIEWING_RECRUITMENT_FULFILLED';
export type SET_VIEWING_RECRUITMENT_FULFILLED = typeof SET_VIEWING_RECRUITMENT_FULFILLED;

export interface SetViewingRecruitmentFulfilled {
    type: SET_VIEWING_RECRUITMENT_FULFILLED;
    title: string;
}

export function setViewingRecruitmentFulfilled(title: string): SetViewingRecruitmentFulfilled {
    return {
        type: SET_VIEWING_RECRUITMENT_FULFILLED,
        title
    };
}

export const SET_SHOULD_UPDATE_RECRUITMENT = 'SET_SHOULD_UPDATE_RECRUITMENT';
export type SET_SHOULD_UPDATE_RECRUITMENT = typeof SET_SHOULD_UPDATE_RECRUITMENT;

export interface SetShouldUpdateRecruitment {
    type: SET_SHOULD_UPDATE_RECRUITMENT;
}

export function setShouldUpdateRecruitment(): SetShouldUpdateRecruitment {
    return {
        type: SET_SHOULD_UPDATE_RECRUITMENT,
    };
}

export const ADD_MESSAGE = 'ADD_MESSAGE';
export type ADD_MESSAGE = typeof ADD_MESSAGE;

export interface AddMessage {
    type: ADD_MESSAGE;
    message: Message;
}

export function addMessage(message: Message): AddMessage {
    return {
        type: ADD_MESSAGE,
        message
    };
}

export const SEND_MESSAGE = 'SEND_MESSAGE';
export type SEND_MESSAGE = typeof SEND_MESSAGE;

export interface SendMessage {
    type: SEND_MESSAGE;
    message: Message;
}

export function sendMessage(message: Message): SendMessage {
    return {
        type: SEND_MESSAGE,
        message
    };
}

export const SEND_SMS = 'SEND_SMS';
export type SEND_SMS = typeof SEND_SMS;

export interface SendSMS {
    type: SEND_SMS;
    content: object;
}

export function sendSMS(content: object): SendSMS {
    return {
        type: SEND_SMS,
        content,
    };
}

export const GET_VERIFY_CODE = 'GET_VERIFY_CODE';
export type GET_VERIFY_CODE = typeof GET_VERIFY_CODE;

export interface GetVerifyCode {
    type: GET_VERIFY_CODE;
}

export function getVerifyCode(): GetVerifyCode {
    return {
        type: GET_VERIFY_CODE,
    };
}

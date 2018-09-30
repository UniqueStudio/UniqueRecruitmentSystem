import { Candidate, Comment, Recruitment, User } from '../lib/const';

export const TOGGLE_DRAWER_OPEN = 'TOGGLE_DRAWER_OPEN';
export type TOGGLE_DRAWER_OPEN = typeof TOGGLE_DRAWER_OPEN;

export interface ToggleDrawerOpen {
    type: TOGGLE_DRAWER_OPEN;
}

export function toggleDrawerOpen(): ToggleDrawerOpen {
    return {
        type: TOGGLE_DRAWER_OPEN
    }
}

export const TOGGLE_SNACKBAR_ON = 'TOGGLE_SNACKBAR_ON';
export type TOGGLE_SNACKBAR_ON = typeof TOGGLE_SNACKBAR_ON;

export interface ToggleSnackbarOn {
    type: TOGGLE_SNACKBAR_ON;
    color: string;
    info: string;
}

export function toggleSnackbarOn(info: string, color: string): ToggleSnackbarOn {
    return {
        type: TOGGLE_SNACKBAR_ON,
        color,
        info
    }
}

export const TOGGLE_SNACKBAR_OFF = 'TOGGLE_SNACKBAR_OFF';
export type TOGGLE_SNACKBAR_OFF = typeof TOGGLE_SNACKBAR_OFF;

export interface ToggleSnackbarOff {
    type: TOGGLE_SNACKBAR_OFF;
}

export function toggleSnackbarOff(): ToggleSnackbarOff {
    return {
        type: TOGGLE_SNACKBAR_OFF
    }
}

export const TOGGLE_MODAL_ON = 'TOGGLE_MODAL_ON';
export type TOGGLE_MODAL_ON = typeof TOGGLE_MODAL_ON;

export interface ToggleModalOn {
    type: TOGGLE_MODAL_ON;
    cid: string;
}

export function toggleModalOn(cid: string): ToggleModalOn {
    return {
        type: TOGGLE_MODAL_ON,
        cid
    }
}

export const TOGGLE_MODAL_OFF = 'TOGGLE_MODAL_OFF';
export type TOGGLE_MODAL_OFF = typeof TOGGLE_MODAL_OFF;

export interface ToggleModalOff {
    type: TOGGLE_MODAL_OFF;
}

export function toggleModalOff(): ToggleModalOff {
    return {
        type: TOGGLE_MODAL_OFF,
    }
}

export const TOGGLE_FAB_ON = 'TOGGLE_FAB_ON';
export type TOGGLE_FAB_ON = typeof TOGGLE_FAB_ON;

export interface ToggleFabOn {
    type: TOGGLE_FAB_ON;
    step: number
}

export function toggleFabOn(step: number): ToggleFabOn {
    return {
        type: TOGGLE_FAB_ON,
        step
    }
}

export const TOGGLE_FAB_OFF = 'TOGGLE_FAB_OFF';
export type TOGGLE_FAB_OFF = typeof TOGGLE_FAB_OFF;

export interface ToggleFabOff {
    type: TOGGLE_FAB_OFF;
}

export function toggleFabOff(): ToggleFabOff {
    return {
        type: TOGGLE_FAB_OFF,
    }
}

export const RECORD_INPUTTING_COMMENT = 'RECORD_INPUTTING_COMMENT';
export type RECORD_INPUTTING_COMMENT = typeof RECORD_INPUTTING_COMMENT;

export interface RecordInputtingComment {
    type: RECORD_INPUTTING_COMMENT;
    comment: string;
    evaluation: string;
}

export function recordInputtingComment(comment: string, evaluation: string): RecordInputtingComment {
    return {
        type: RECORD_INPUTTING_COMMENT,
        comment,
        evaluation
    }
}

export const ADD_COMMENT_START = 'ADD_COMMENT_START';
export type ADD_COMMENT_START = typeof ADD_COMMENT_START;

export interface AddCommentStart {
    type: ADD_COMMENT_START;
    step: number;
    cid: string;
    commenter: string;
    comment: Comment;
}

export function addCommentStart(step: number, cid: string, commenter: string, comment: Comment): AddCommentStart {
    return {
        type: ADD_COMMENT_START,
        step,
        cid,
        commenter,
        comment
    }
}


export const ADD_COMMENT_FULFILLED = 'ADD_COMMENT_FULFILLED';
export type ADD_COMMENT_FULFILLED = typeof ADD_COMMENT_FULFILLED;

export interface AddCommentFulfilled {
    type: ADD_COMMENT_FULFILLED;
    step: number;
    cid: string;
    commenter: string;
    comment: Comment;
}

export function addCommentFulfilled(step: number, cid: string, commenter: string, comment: Comment): AddCommentFulfilled {
    return {
        type: ADD_COMMENT_FULFILLED,
        step,
        cid,
        commenter,
        comment
    }
}

export const REMOVE_COMMENT_START = 'REMOVE_COMMENT_START';
export type REMOVE_COMMENT_START = typeof REMOVE_COMMENT_START;

export interface RemoveCommentStart {
    type: REMOVE_COMMENT_START;
    step: number;
    cid: string;
    commenter: string;
}

export function removeCommentStart(step: number, cid: string, commenter: string): RemoveCommentStart {
    return {
        type: REMOVE_COMMENT_START,
        step,
        cid,
        commenter,
    }
}

export const REMOVE_COMMENT_FULFILLED = 'REMOVE_COMMENT_FULFILLED';
export type REMOVE_COMMENT_FULFILLED = typeof REMOVE_COMMENT_FULFILLED;

export interface RemoveCommentFulfilled {
    type: REMOVE_COMMENT_FULFILLED;
    step: number;
    cid: string;
    commenter: string;
}

export function removeCommentFulfilled(step: number, cid: string, commenter: string): RemoveCommentFulfilled {
    return {
        type: REMOVE_COMMENT_FULFILLED,
        step,
        cid,
        commenter,
    }
}


export const GET_CANDIDATES_START = 'GET_CANDIDATES_START';
export type GET_CANDIDATES_START = typeof GET_CANDIDATES_START;

export interface GetCandidatesStart {
    type: GET_CANDIDATES_START;
    group: string;
    recruitmentName: string;
}

export function getCandidatesStart(group: string, recruitmentName: string): GetCandidatesStart {
    return {
        type: GET_CANDIDATES_START,
        group,
        recruitmentName
    }
}

export const GET_CANDIDATES_FULFILLED = 'GET_CANDIDATES_FULFILLED';
export type GET_CANDIDATES_FULFILLED = typeof GET_CANDIDATES_FULFILLED;

export interface GetCandidatesFulfilled {
    type: GET_CANDIDATES_FULFILLED;
    candidates: object[];
}

export function getCandidatesFulfilled(candidates: object[]): GetCandidatesFulfilled {
    return {
        type: GET_CANDIDATES_FULFILLED,
        candidates,
    }
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
        cid
    }
}

export const ADD_CANDIDATE_FULFILLED = 'ADD_CANDIDATE_FULFILLED';
export type ADD_CANDIDATE_FULFILLED = typeof ADD_CANDIDATE_FULFILLED;

export interface AddCandidateFulfilled {
    type: ADD_CANDIDATE_FULFILLED;
    candidate: Candidate;
}

export function addCandidateFulfilled(candidate: Candidate): AddCandidateFulfilled {
    return {
        type: ADD_CANDIDATE_FULFILLED,
        candidate,
    }
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
    }
}

export const DESELECT_CANDIDATE = 'DESELECT_CANDIDATE';
export type DESELECT_CANDIDATE = typeof DESELECT_CANDIDATE;

export interface DeselectCandidate {
    type: DESELECT_CANDIDATE;
    cid: string | string[];
}

export function deselectCandidate(cid: string | Array<string>): DeselectCandidate {
    return {
        type: DESELECT_CANDIDATE,
        cid,
    }
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
    }
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
    }
}

export const MOVE_CANDIDATE_START = 'MOVE_CANDIDATE_START';
export type MOVE_CANDIDATE_START = typeof MOVE_CANDIDATE_START;

export interface MoveCandidateStart {
    type: MOVE_CANDIDATE_START;
    from: number;
    to: number;
    cid: string;
    position?: number;
}

export function moveCandidateStart(from: number, to: number, cid: string, position?: number): MoveCandidateStart {
    return {
        type: MOVE_CANDIDATE_START,
        from,
        to,
        cid,
        position,
    }
}


export const MOVE_CANDIDATE_FULFILLED = 'MOVE_CANDIDATE_FULFILLED';
export type MOVE_CANDIDATE_FULFILLED = typeof MOVE_CANDIDATE_FULFILLED;

export interface MoveCandidateFulfilled {
    type: MOVE_CANDIDATE_FULFILLED;
    from: number;
    to: number;
    cid: string;
    position?: number;
}

export function moveCandidateFulfilled(from: number, to: number, cid: string, position?: number): MoveCandidateFulfilled {
    return {
        type: MOVE_CANDIDATE_FULFILLED,
        from,
        to,
        cid,
        position,
    }
}

export const SET_ONE_SLOT_START = 'SET_ONE_SLOT_START';
export type SET_ONE_SLOT_START = typeof SET_ONE_SLOT_START;

export interface SetOneSlotStart {
    type: SET_ONE_SLOT_START;
    id: string;
    time: object;
}

export function setOneSlotStart(id: string, time: object): SetOneSlotStart {
    return {
        type: SET_ONE_SLOT_START,
        id,
        time,
    }
}

export const SET_All_SLOTS_START = 'SET_All_SLOTS_START';
export type SET_All_SLOTS_START = typeof SET_All_SLOTS_START;

export interface SetAllSlotsStart {
    type: SET_All_SLOTS_START;
    title: string;
    slots: number[];
    group: string;
}

export function setAllSlotsStart(title: string, slots: number[], group: string): SetAllSlotsStart {
    return {
        type: SET_All_SLOTS_START,
        title,
        slots,
        group
    }
}


export const SET_SLOTS_FULFILLED = 'SET_SLOTS_FULFILLED';
export type SET_SLOTS_FULFILLED = typeof SET_SLOTS_FULFILLED;

export interface SetSlotsFulfilled {
    type: SET_SLOTS_FULFILLED;
    interview: 1 | 2;
    slot: object[]
}

export function setSlotsFulfilled(slot: object[], interview: 1 | 2): SetSlotsFulfilled {
    return {
        type: SET_SLOTS_FULFILLED,
        slot,
        interview
    }
}

export const SET_GROUP = 'SET_GROUP';
export type SET_GROUP = typeof SET_GROUP;

export interface SetGroup {
    type: SET_GROUP;
    group: string
}

export function setGroup(group: string): SetGroup {
    return {
        type: SET_GROUP,
        group
    }
}


export const LOGIN = 'LOGIN';
export type LOGIN = typeof LOGIN;

export interface Login {
    type: LOGIN;
    uid: string;
}

export function login(uid: string): Login {
    return {
        type: LOGIN,
        uid
    }
}

export const LOGOUT = 'LOGOUT';
export type LOGOUT = typeof LOGOUT;

export interface Logout {
    type: LOGOUT;
}

export function logout(): Logout {
    return {
        type: LOGOUT
    }
}

export const GET_QR_CODE_START = 'GET_QR_CODE_START';
export type GET_QR_CODE_START = typeof GET_QR_CODE_START;

export interface GetQRCodeStart {
    type: GET_QR_CODE_START
}

export function getQRCodeStart(): GetQRCodeStart {
    return {
        type: GET_QR_CODE_START
    }
}

export const GET_QR_CODE_FULFILLED = 'GET_QR_CODE_FULFILLED';
export type GET_QR_CODE_FULFILLED = typeof GET_QR_CODE_FULFILLED;

export interface GetQRCodeFulfilled {
    type: GET_QR_CODE_FULFILLED;
    key: string
}

export function getQRCodeFulfilled(key: string): GetQRCodeFulfilled {
    return {
        type: GET_QR_CODE_FULFILLED,
        key
    }
}

export const GET_USER_INFO_START = 'GET_USER_INFO_START';
export type GET_USER_INFO_START = typeof GET_USER_INFO_START;

export interface GetUserInfoStart {
    type: GET_USER_INFO_START;
    uid: string
}

export function getUserInfoStart(uid: string): GetUserInfoStart {
    return {
        type: GET_USER_INFO_START,
        uid
    }
}

export const SET_USER_INFO_START = 'SET_USER_INFO_START';
export type SET_USER_INFO_START = typeof SET_USER_INFO_START;

export interface SetUserInfoStart {
    type: SET_USER_INFO_START;
    info: User;
    uid: string;
}

export function setUserInfoStart(uid: string, info: User): SetUserInfoStart {
    return {
        type: SET_USER_INFO_START,
        info,
        uid
    }
}

export const USER_INFO_FULFILLED = 'USER_INFO_FULFILLED';
export type USER_INFO_FULFILLED = typeof USER_INFO_FULFILLED;

export interface UserInfoFulfilled {
    type: USER_INFO_FULFILLED;
    info: User;
}

export function userInfoFulfilled(info: User): UserInfoFulfilled {
    return {
        type: USER_INFO_FULFILLED,
        info: { ...info, sex: info.sex || 'Male', isAdmin: info.isAdmin || false, isCaptain: info.isCaptain || false }
    }
}

export const GET_GROUP_INFO_START = 'GET_GROUP_INFO_START';
export type GET_GROUP_INFO_START = typeof GET_GROUP_INFO_START;

export interface GetGroupInfoStart {
    type: GET_GROUP_INFO_START;
    group: string
}

export function getGroupInfoStart(group: string): GetGroupInfoStart {
    return {
        type: GET_GROUP_INFO_START,
        group
    }
}


export const GET_GROUP_INFO_FULFILLED = 'GET_GROUP_INFO_FULFILLED';
export type GET_GROUP_INFO_FULFILLED = typeof GET_GROUP_INFO_FULFILLED;

export interface GetGroupInfoFulfilled {
    type: GET_GROUP_INFO_FULFILLED;
    info: User[]
}

export function getGroupInfoFulfilled(info: User[]): GetGroupInfoFulfilled {
    return {
        type: GET_GROUP_INFO_FULFILLED,
        info
    }
}

export const GET_RECRUITMENTS_START = 'GET_RECRUITMENTS_START';
export type GET_RECRUITMENTS_START = typeof GET_RECRUITMENTS_START;

export interface GetRecruitmentsStart {
    type: GET_RECRUITMENTS_START;
}

export function getRecruitmentsStart(): GetRecruitmentsStart {
    return {
        type: GET_RECRUITMENTS_START,
    }
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
    }
}

export const LAUNCH_RECRUITMENT = 'LAUNCH_RECRUITMENT';
export type LAUNCH_RECRUITMENT = typeof LAUNCH_RECRUITMENT;

export interface LaunchRecruitment {
    type: LAUNCH_RECRUITMENT;
    info: object;
}

export function launchRecruitment(info: object): LaunchRecruitment {
    return {
        type: LAUNCH_RECRUITMENT,
        info,
    }
}

export const SET_RECRUITMENT = 'SET_RECRUITMENT';
export type SET_RECRUITMENT = typeof SET_RECRUITMENT;

export interface SetRecruitment {
    type: SET_RECRUITMENT;
    data: object;
}

export function setRecruitment(data: object): SetRecruitment {
    return {
        type: SET_RECRUITMENT,
        data
    }
}

// export const UPDATE_RECRUITMENT = 'UPDATE_RECRUITMENT';
// export type UPDATE_RECRUITMENT = typeof UPDATE_RECRUITMENT;
//
// export interface UpdateRecruitment {
//     type: UPDATE_RECRUITMENT;
//     recruitment: Recruitment;
// }
//
// export function updateRecruitment(recruitment: Recruitment): UpdateRecruitment {
//     return {
//         type: UPDATE_RECRUITMENT,
//         recruitment,
//     }
// }

export const SET_SHOULD_UPDATE_RECRUITMENT = 'SET_SHOULD_UPDATE_RECRUITMENT';
export type SET_SHOULD_UPDATE_RECRUITMENT = typeof SET_SHOULD_UPDATE_RECRUITMENT;

export interface SetShouldUpdateRecruitment {
    type: SET_SHOULD_UPDATE_RECRUITMENT;
}

export function setShouldUpdateRecruitment(): SetShouldUpdateRecruitment {
    return {
        type: SET_SHOULD_UPDATE_RECRUITMENT,
    }
}

export const ADD_MESSAGE = 'ADD_MESSAGE';
export type ADD_MESSAGE = typeof ADD_MESSAGE;

export interface AddMessage {
    type: ADD_MESSAGE;
    name: string;
    avatar: string;
    time: number;
    message: string;
    isSelf: boolean;
}

export function addMessage(name: string, avatar: string, time: number, message: string, isSelf: boolean): AddMessage {
    return {
        type: ADD_MESSAGE,
        name,
        avatar,
        time,
        message,
        isSelf
    }
}

export const SEND_MESSAGE = 'SEND_MESSAGE';
export type SEND_MESSAGE = typeof SEND_MESSAGE;

export interface SendMessage {
    type: SEND_MESSAGE;
    message: string;
}

export function sendMessage(message: string): SendMessage {
    return {
        type: SEND_MESSAGE,
        message,
    }
}

export const SEND_IMAGE = 'SEND_IMAGE';
export type SEND_IMAGE = typeof SEND_IMAGE;

export interface SendImage {
    type: SEND_IMAGE;
    image: string;
}

export function sendImage(image: string): SendImage {
    return {
        type: SEND_IMAGE,
        image,
    }
}

export const ADD_IMAGE = 'ADD_IMAGE';
export type ADD_IMAGE = typeof ADD_IMAGE;

export interface AddImage {
    type: ADD_IMAGE;
    name: string;
    avatar: string;
    time: number;
    image: string;
    isSelf: boolean;
}

export function addImage(name: string, avatar: string, time: number, image: string, isSelf: boolean): AddImage {
    return {
        type: ADD_IMAGE,
        name,
        avatar,
        time,
        image,
        isSelf
    }
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
    }
}

export const SEND_INTERVIEW = 'SEND_INTERVIEW';
export type SEND_INTERVIEW = typeof SEND_INTERVIEW;

export interface SendInterview {
    type: SEND_INTERVIEW;
    content: object;
}

export function sendInterview(content: object): SendInterview {
    return {
        type: SEND_INTERVIEW,
        content,
    }
}

export const GET_VERIFY_CODE = 'GET_VERIFY_CODE';
export type GET_VERIFY_CODE = typeof GET_VERIFY_CODE;

export interface GetVerifyCode {
    type: GET_VERIFY_CODE;
}

export function getVerifyCode(): GetVerifyCode {
    return {
        type: GET_VERIFY_CODE,
    }
}

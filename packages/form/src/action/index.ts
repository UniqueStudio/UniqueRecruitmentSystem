export const SET_INFO = 'SET_INFO';
export type SET_INFO = typeof SET_INFO;
export interface SetInfo {
    type: SET_INFO;
    payload: object;
}
export function setInfo(prop: object): SetInfo {
    return {
        type: SET_INFO,
        payload: prop
    }
}
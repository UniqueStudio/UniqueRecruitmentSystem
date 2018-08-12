import { getQRCodeEpic, loginEpic } from './login';
import { actionTypeCreator } from '../index';

export const USER = actionTypeCreator('USER');

export interface UserAction {
    type: string
}


export default [getQRCodeEpic, loginEpic];
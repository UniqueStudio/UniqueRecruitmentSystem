import { getQRCodeEpic, loginEpic } from './login';
import { getInfoEpic } from './getInfo';
import { getGroupEpic } from './getGroup';
import { updateInfoEpic } from './updateInfo';

import { actionTypeCreator } from '../index';

export const USER = actionTypeCreator('USER');

export interface UserAction {
    type: string
}


export default [getQRCodeEpic, loginEpic, getInfoEpic, getGroupEpic, updateInfoEpic];
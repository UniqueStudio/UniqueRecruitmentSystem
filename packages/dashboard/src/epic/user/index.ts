import { getQRCodeEpic, loginEpic } from './login';
import { getInfoEpic } from './getInfo';
import { getGroupEpic } from './getGroup';
import { updateInfoEpic } from './updateInfo';

export default [getQRCodeEpic, loginEpic, getInfoEpic, getGroupEpic, updateInfoEpic];
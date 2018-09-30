import { getGroupEpic } from './getGroup';
import { getInfoEpic } from './getInfo';
import { getQRCodeEpic, loginEpic } from './login';
import { setInfoEpic } from './setInfo';

export default [getQRCodeEpic, loginEpic, getInfoEpic, getGroupEpic, setInfoEpic];

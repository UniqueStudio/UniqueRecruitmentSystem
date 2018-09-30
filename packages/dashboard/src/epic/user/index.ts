import { getQRCodeEpic, loginEpic } from './login';
import { getInfoEpic } from './getInfo';
import { getGroupEpic } from './getGroup';
import { setInfoEpic } from './setInfo';

export default [getQRCodeEpic, loginEpic, getInfoEpic, getGroupEpic, setInfoEpic];
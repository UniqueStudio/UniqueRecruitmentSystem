import { getGroupEpic } from './getGroup';
import { getInfoEpic } from './getInfo';
import { getQRCodeEpic, loginEpic, scanQRCodeEpic } from './login';
import { setGroupAdminEpic} from './setAdmin';
import { setInfoEpic } from './setInfo';

export default [getQRCodeEpic, scanQRCodeEpic, loginEpic, getInfoEpic, getGroupEpic, setInfoEpic, setGroupAdminEpic];

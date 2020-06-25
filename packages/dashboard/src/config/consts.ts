export const GROUPS = ['Web', 'Lab', 'AI', 'Game', 'Android', 'iOS', 'Design', 'PM'];
export const GROUPS_ = GROUPS.map((group) => group.toLowerCase());
export const STEPS = ['报名流程', '笔试流程', '面试流程', '熬测流程', '群面流程', '通过'];
export const RANKS = ['暂无', '前10%', '前25%', '前50%', '前100%'];
export const GRADES = ['大一', '大二', '大三', '大四', '研一', '研二', '研三'];
export const GENDERS = ['其他', '男', '女'];
export const API = process.env.NODE_ENV === 'production' ? 'https://hustunique.com:5000' : 'http://192.168.1.200:5000';
export const QR_CODE_URL = 'https://open.work.weixin.qq.com/wwopen/sso/qrImg?key=';

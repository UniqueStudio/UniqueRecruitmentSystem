const { APP_ID, AGENT_ID, REDIRECT_URI, CORP_ID, CORP_SECRET, TOKEN, DB_PORT, SECRET } = process.env;
const { ACM_DATAID, ACM_GROUP, ACM_NAMESPACE, ACM_ACCESS_KEY, ACM_SECRET_KEY } = process.env;
const QRCodeAPI = `https://open.work.weixin.qq.com/wwopen/sso`;
export const getQRCodeURL = `${QRCodeAPI}/qrConnect?appid=${APP_ID}&agentid=${AGENT_ID}&redirect_uri=${REDIRECT_URI}`;
export const scanningURL = `${QRCodeAPI}/l/qrConnect?key=`;
const weChatAPI = 'https://qyapi.weixin.qq.com/cgi-bin';
export const accessTokenURL = `${weChatAPI}/gettoken?corpid=${CORP_ID}&corpsecret=${CORP_SECRET}`;
export const userIDURL = (accessToken: string, code: string) => `${weChatAPI}/user/getuserinfo?access_token=${accessToken}&code=${code}`;
export const userInfoURL = (accessToken: string, uid: string) => `${weChatAPI}/user/get?access_token=${accessToken}&userid=${uid}`;
export const smsAPI = `https://open.hustunique.com/message/sms`;
export const token = TOKEN!;
export const formURL = 'https://join.hustunique.com';
export const dbURI = `mongodb://mongodb:${DB_PORT}/recruitment`;

export const GROUPS = ['Web', 'Lab', 'AI', 'Game', 'Android', 'iOS', 'Design', 'PM'];
export const GROUPS_ = GROUPS.map((group) => group.toLowerCase());
export const STEPS = ['报名流程', '笔试流程', '面试流程', '熬测流程', '群面流程', '通过'];
export const RANKS = ['暂无', '前10%', '前25%', '前50%', '前100%'];
export const GRADES = ['大一', '大二', '大三', '大四', '研一', '研二', '研三'];
export const GENDERS = ['其他', '男', '女'];
export const EVALUATIONS = ['好', '一般', '差'];

export const ID_TO_GROUP = {
    2: 'web',
    3: 'pm',
    4: 'ai',
    5: 'android',
    6: 'game',
    7: 'lab',
    8: 'ios',
    9: 'design',
    15: 'web',
    16: 'android',
    17: 'ai',
    18: 'game',
    19: 'ios',
    20: 'design',
    21: 'lab',
    22: 'lab',
    23: 'lab',
    24: 'lab',
    25: 'pm',
};
export const secret = SECRET!;

export const Acm = {
    endpoint: 'acm.aliyun.com',
    dataId: ACM_DATAID!,
    group: ACM_GROUP!,
    namespace: ACM_NAMESPACE!,
    accessKey: ACM_ACCESS_KEY!,
    secretKey: ACM_SECRET_KEY!
};

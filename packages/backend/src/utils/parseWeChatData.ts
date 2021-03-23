import { ID_GROUP_MAP } from '@constants/consts';
import { Gender } from '@constants/enums';

interface Data {
    userid: string;
    name: string;
    mobile: string;
    avatar: string;
    isleader: number;
    is_leader_in_dept: number[];
    gender: string;
    extattr: {
        attrs: { name: string; value: string }[];
    };
    email: string;
    department: number[];
}

export const parseWeChatData = (data: Data) => {
    const { userid, name, mobile, avatar, isleader, is_leader_in_dept, gender, extattr, email, department } = data;
    const isCaptain = isleader === 1 || is_leader_in_dept.includes(1);
    const groups = department.filter((i) => ID_GROUP_MAP[i] !== undefined);
    if (!groups[0]) {
        throw new Error('Please set group info in WeChat first!');
    }
    if (!mobile) {
        throw new Error('Please set phone number in WeChat first!');
    }
    let joinTime = extattr.attrs.find((attr) => attr.name === '加入时间')?.value;
    if (!joinTime) {
        throw new Error('Please set join time in WeChat first!');
    }
    if (joinTime.includes('春')) {
        joinTime = joinTime.replace(/春.*/g, 'S');
    } else if (joinTime.includes('秋')) {
        joinTime = joinTime.replace(/秋.*/g, 'A');
    } else if (joinTime.includes('夏')) {
        joinTime = joinTime.replace(/夏.*/g, 'C');
    } else {
        throw new Error('Format of join time is not correct!');
    }
    return {
        weChatID: userid,
        name,
        joinTime,
        phone: mobile,
        mail: email,
        gender: +gender as Gender,
        group: ID_GROUP_MAP[groups[0]],
        avatar: avatar?.replace('http://', 'https://'),
        isCaptain,
    };
};

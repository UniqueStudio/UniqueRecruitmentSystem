import { RequestHandler } from 'express';
import fetch from 'node-fetch';
import { accessTokenURL, ID_TO_GROUP, scanningURL, userIDURL, userInfoURL } from '../../config/consts';
import { UserRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';
import { generateJWT } from '../../utils/generateJWT';

interface Data {
    userid: string;
    name: string;
    mobile: string;
    avatar: string;
    isleader: number;
    is_leader_in_dept: number[];
    gender: string;
    extattr: {
        attrs: { name: string, value: string }[]
    };
    email: string;
    department: number[];
}

const parseUserInfo = (data: Data) => {
    const {
        userid: weChatID,
        name: username,
        mobile: phone,
        avatar,
        isleader,
        is_leader_in_dept,
        gender,
        extattr,
        email: mail,
        department
    } = data;
    const isCaptain = isleader === 1 || is_leader_in_dept.includes(1);
    const groups = department.filter((i: number) => ID_TO_GROUP[i] !== undefined);
    if (!groups[0]) {
        throw new Error('Please set group info in WeChat first!');
    }
    if (!phone) {
        throw new Error('Please set phone number in WeChat first!');
    }
    const group = ID_TO_GROUP[groups[0]];
    const { attrs } = extattr;
    let joinTime;
    try {
        joinTime = attrs.filter((attr: { name: string, value: string }) => attr.name === '加入时间')[0].value;
    } catch (error) {
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
        weChatID,
        username,
        joinTime,
        phone,
        avatar: avatar ? avatar.replace('http://', 'https://') : '',
        mail,
        isCaptain,
        isAdmin: false,
        gender: +gender,
        group
    };
};

// API of WeChat is a shit
export const handleScan: RequestHandler = async (req, res, next) => {
    try {
        const scanResponse = await fetch(`${scanningURL}${req.params.key}`);
        const scanResult = await scanResponse.text();
        const status = JSON.parse(scanResult.match(/{.+}/)![0]).status;

        if (status !== 'QRCODE_SCAN_ING') {
            return next(errorRes('Time out, please login again', 'info'));
        } else {
            const loginResponse = await fetch(`${scanningURL}${req.params.key}&lastStatus=${status}`);
            const loginResult = await loginResponse.text();
            const loginObj = JSON.parse(loginResult.match(/{.+}/)![0]);

            if (loginObj.status !== 'QRCODE_SCAN_SUCC') {
                return next(errorRes('Failed to login', 'warning'));
            } else {
                const auth_code = loginObj.auth_code;

                const accessTokenResponse = await fetch(accessTokenURL);
                const accessTokenResult = await accessTokenResponse.json();
                const accessToken = accessTokenResult.access_token;

                const userIDResponse = await fetch(userIDURL(accessToken, auth_code));
                const userIDResult = await userIDResponse.json();
                const userID = userIDResult.UserId;

                const userInfoResponse = await fetch(userInfoURL(accessToken, userID));
                const userInfoResult = await userInfoResponse.json();
                const data = parseUserInfo(userInfoResult);
                const users = await UserRepo.query({ weChatID: data.weChatID });
                const user = users.length ? users[0] : await UserRepo.createAndInsert(data);
                if (data.isCaptain && !user.isCaptain) {
                    await UserRepo.updateById(user._id, { isCaptain: true, isAdmin: true });
                }
                const token = generateJWT({ id: user._id }, 604800);
                res.json({ token, type: 'success' });
            }
        }
    } catch (error) {
        return next(error);
    }
};
